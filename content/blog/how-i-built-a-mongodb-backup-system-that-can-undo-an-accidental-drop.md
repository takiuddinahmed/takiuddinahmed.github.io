---
title: "How I Built a MongoDB Backup System That Can Undo an Accidental Drop"
date: 2026-07-24
description: "Point-in-time recovery for MongoDB, explained simply: how I built mongopit — an open-source, Docker-based backup tool that can restore your database to the exact second before an accidental collection drop, using the oplog."
tags: [mongodb, backup, docker, python]
slug: how-i-built-a-mongodb-backup-system-that-can-undo-an-accidental-drop
draft: false
---
Every developer has the same nightmare. Someone runs a command on the wrong database, a collection gets dropped, and suddenly the data is just gone. Your last backup was from midnight, so you can restore that, but you still lose everything that happened after midnight.

I wanted something better. Not just "restore last night's backup" but "restore the database to the exact second before the drop happened." That feature has a name: point-in-time recovery, or PITR. This post is about how I built it, and the one small MongoDB fact that makes the whole thing possible.

The project is open source and called `mongopit`. You can find it here:

**https://github.com/takiuddinahmed/mongopit**

## The core problem

A normal backup is a photo. You take one at midnight, another at noon, and if something goes wrong at 11am you are stuck with the midnight photo. Everything between midnight and 11am is lost.

Point-in-time recovery is more like a video. You keep the midnight photo, but you also record every single change after it. When disaster strikes, you can play the video forward and stop it one frame before the bad thing happened.

In MongoDB, that "video" already exists. It is called the oplog.

## The one fact that changes everything

The oplog (operations log) is an ordered record of every write MongoDB makes. Every insert, update, and delete goes into it. If you have the oplog, you can replay history.

Here is the catch that surprises a lot of people. A standalone MongoDB server has no oplog. The oplog only exists on replica set members. So if you are running a plain single MongoDB, you cannot do point-in-time recovery at all, no matter what backup tool you use.

The fix is simple and it does not need extra servers. You run your MongoDB as a single-node replica set. It is still one machine, one process, one data directory. You just turn replication on. That one change gives you an oplog, and the oplog gives you PITR.

This is the reason the whole system is shaped the way it is. If you ever see the setup and think "why not just run it standalone," this is why.

## How the recovery actually works

The system has two things running at all times.

First, a scheduled full backup. This uses `mongodump --oplog` to take a consistent snapshot of everything. Before the dump, it records the current oplog position. Think of this as the photo, plus a note saying "this photo was taken at frame 5000."

Second, a continuous oplog tailer. This is a small process that watches the oplog and keeps copying new operations into files. It runs all the time, flushing every few seconds. This is the video recording that never stops.

Both of these get compressed and shipped off to storage.

When you need to recover, three steps happen:

1. Find the most recent full backup taken before your target time. Restore it. Now you have the database as it was at the photo.
2. Gather all the recorded oplog operations between the photo and your target time.
3. Replay those operations, but tell MongoDB to stop just before the target timestamp.

That last part is the magic. `mongorestore` has a flag called `--oplogLimit`, and it is exclusive. Any operation at or after that timestamp is skipped. So if you set the limit to the exact timestamp of the drop, the replay stops right before it. The drop never happens in your restored copy. Everything up to that instant is saved.

To find that exact timestamp, the tool has an `inspect` command that scans the oplog and shows you destructive operations like drops and deletes, with the precise timestamp to stop before. You copy that timestamp, paste it into the restore command, and you are done.

## Why replaying the same data twice is safe

You might notice a small overlap. The full backup already contains some oplog data, and then we replay external oplog on top of it. Are we not applying some operations twice?

Yes, and it does not matter. MongoDB's oplog replay is idempotent. Applying the same operation twice gives the same result as applying it once. Inserts become upserts, and so on. This is a nice property because it means restarts and overlaps never corrupt the result. It also means I did not have to write clever code to track exactly-once delivery, which is where bugs love to hide.

## Where the backups go

I wanted to store backups on Google Drive, mostly because it is cheap and easy for a small setup. No mainstream backup tool supports Google Drive directly, so I used `rclone`, which speaks to dozens of storage backends including Drive.

Everything that touches storage goes through one thin wrapper around the `rclone` command line, with retries and backoff built in. There is no separate database or index tracking what backups exist. The storage itself is the source of truth. To figure out what is available, the system just lists the files. Full backups live in one folder, oplog segments in another, and the file names carry the timestamps. Fewer moving parts means fewer things that can drift out of sync.

## A few things I learned building it

Timestamps show up in three different shapes. One format for file names, one for the restore command line, and one for the metadata files. I kept getting them mixed up until I wrote small helper functions for each and used them everywhere. If you deal with MongoDB timestamps, do this early.

Retention is easy to get wrong in a dangerous way. I used a grandfather-father-son policy, keeping some daily, weekly, and monthly backups. The important rule is that you must never delete oplog segments if they still have no full backup to sit on top of. An oplog segment with no base to apply onto is useless. Prune in the wrong order and you quietly destroy your ability to recover.

A backup you have never restored is not a backup. It is a hope. So the system has a verify step that spins up a throwaway MongoDB container, restores the latest backup into it, checks that the data is actually there, and then throws the container away. If that ever fails, you find out on a normal Tuesday instead of during a real emergency.

## The whole thing runs in Docker

Everything ships as a Docker Compose stack. There is the MongoDB container running as a single-node replica set, and one backup agent container that does three jobs in one process: it makes sure the replica set is initiated on startup, it runs the oplog tailer in a background thread, and it runs the scheduler for full backups, retention, and verification. I started with three separate services and combined them into one. The memory savings are modest, but the simplicity is real.

## How to actually use it

Here is what running the tool looks like in practice.

**Step 0: Get it.**

Clone the repository and you have everything you need. It ships as a Docker Compose stack, so you do not have to install Python or MongoDB tools by hand.

```bash
git clone https://github.com/takiuddinahmed/mongopit.git
cd mongopit
```

**Step 1: Point it at your MongoDB and storage.**

Everything is driven by a `.env` file and an `rclone.conf`. You tell it your MongoDB connection string, your rclone remote (like Google Drive), how often to run full backups, and how many daily, weekly, and monthly copies to keep.

If your MongoDB is currently standalone, you do a one-time conversion to a single-node replica set. Stop it, start it again with `--replSet rs0`, connect with `mongosh`, and run this once:

```js
rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "yourhost:27017" }] })
```

Your data stays exactly where it is. The oplog starts recording from that moment.

**Step 2: Start the stack.**

```bash
docker compose up -d --build
```

That brings up MongoDB and a single backup agent. The agent initiates the replica set if needed, starts recording the oplog, and schedules your full backups, cleanup, and verification. From here it runs on its own.

**Step 3: Take a backup now if you want one.**

You do not have to wait for the schedule. You can trigger a full backup any time:

```bash
docker compose exec backup-agent mongopit backup-full
```

**Step 4: When something bad happens, find the moment.**

Say a collection got dropped. First you look at the recent history to find the exact timestamp of the drop:

```bash
docker compose exec backup-agent mongopit inspect
```

This prints recent destructive operations with a value called `oplogLimit` next to each one. That value is the timestamp you will recover up to.

**Step 5: Recover to just before it.**

Take the timestamp from the previous step and pass it to the restore command:

```bash
docker compose exec backup-agent mongopit restore \
  --target-uri "mongodb://mongo:27017/?replicaSet=rs0" \
  --point-in-time 1721800020:1 \
  --drop
```

Because the limit is exclusive, the drop is never replayed. The collection comes back with every document that existed the instant before it was dropped.

A good habit: run it with `--dry-run` first. That prints the plan, which base backup and which oplog segments it will use, without touching any data. When you are happy, run it for real. If you are nervous about production, restore into a scratch database first and check it there.

**Other commands you will use.**

```bash
# apply retention now instead of waiting for the schedule
docker compose exec backup-agent mongopit prune

# prove your latest backup actually restores
docker compose exec backup-agent mongopit verify
```

The `verify` command is the one I recommend running on a schedule and not just once. It restores your latest backup into a throwaway container, checks the data is really there, and cleans up after itself. That is how you find out a backup is broken on a calm day rather than during a real incident.

## Trying the recovery drill

The most satisfying test was the drop recovery drill. Seed some documents, take a full backup, add a few more documents, then drop the collection on purpose. Run `inspect` to find the drop timestamp. Run `restore` with that timestamp. Then count the documents. Every single one is back, and the drop is gone, as if it never happened.

The first time that worked exactly as planned, it felt like undoing a mistake in real life. That is the feeling I was chasing when I started.

## Closing thoughts

The interesting part of this project was not the code. It was realizing that MongoDB already keeps a complete recording of every change, and that the only thing standing between you and time travel is turning on replication and capturing that recording before it rolls away.

If you run MongoDB and you are relying on nightly snapshots alone, I would gently suggest looking into point-in-time recovery. The day you need it, you will be very glad it is there.

The tool is open source and free to use. If you want to try it, star it, or open an issue, it lives here:

**https://github.com/takiuddinahmed/mongopit**

You can find more of my work and writing on my website: **https://takiuddin.me**
