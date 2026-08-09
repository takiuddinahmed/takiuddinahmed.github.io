---
title: "A backup you haven't restored isn't a backup"
date: 2026-08-09
description: "We moved Prochesta off Atlas onto self-hosted MongoDB and left ourselves with one copy of the database on one disk. Here's the point-in-time recovery system we built on Cloudflare R2 — and the four things that broke on rollout."
tags: [mongodb, devops, backup, cloudflare]
slug: a-backup-you-havent-restored-isnt-a-backup
draft: false
---

Migrating from MongoDB Atlas to a self-hosted replica set bought us control and cut our bill. It also quietly removed something we had stopped thinking about: Atlas had been taking continuous backups for us the entire time.

After the migration, production data for [Prochesta](https://prochesta.app/) lived in `/var/db/mongo` on a single VPS. No snapshots. No off-box copy. A `rm -rf`, a bad migration script, or a dead disk would have been the end of it. We had written "backups" as a follow-up task in the migration spec, which is the engineering equivalent of a sticky note on a bank vault.

The requirement we actually cared about was narrower than "back up the database". Most real-world data loss at our scale isn't hardware failure — it's a deploy that writes garbage, or someone running an update without a filter. Recovering to *last night* doesn't help when the damage happened at 14:20 and you noticed at 14:50. We needed to recover to **an arbitrary moment**, not to a nightly snapshot.

## The constraint nobody mentions: Community has no `$backupCursor`

We chose [Percona Backup for MongoDB](https://docs.percona.com/percona-backup-mongodb/) (PBM), and immediately hit the limitation that shapes every decision downstream.

PBM offers *physical* backups — fast file-level copies that restore in minutes and barely touch the running server. They work by opening a backup cursor via the `$backupCursor` aggregation stage. That stage exists in Percona Server for MongoDB and in MongoDB Enterprise. It does **not** exist in MongoDB Community, which is what the official `mongo:8.0` image ships.

So on Community, PBM gives you logical backups only: every document read out through `mongod`, compressed, and shipped off-box. Two consequences, both accepted deliberately rather than discovered later:

- Backups cost CPU on the primary — and with a single-member replica set there's no secondary to offload the read to.
- Restores insert documents and rebuild indexes, so restore time grows with data size much faster than backup time does.

At our current size that's minutes, not hours. It's also the thing that will eventually justify swapping the image for Percona Server. Knowing *which* constraint will force the next migration is worth more than pretending there isn't one.

## We had already built one of these. We didn't use it.

I maintain [mongopit](https://github.com/takiuddinahmed/mongopit), a self-hosted MongoDB point-in-time recovery tool. Its architecture is the same shape as what we ended up with: `mongodump --oplog` for consistent full snapshots, a daemon tailing the oplog and streaming compressed BSON segments to cloud storage, and `mongorestore --oplogReplay --oplogLimit` to stop the replay just before the operation that ruined your day. It ships GFS retention, a `--dry-run` restore preview, and runs as a single Docker Compose service.

It stores backups on **Google Drive via rclone**. That's the reason we reached for PBM instead — we wanted Cloudflare R2 as a first-class target, and the reasons are worth spelling out because they aren't really about Drive.

**The data was already there.** Prochesta serves user uploads, receipts and generated PDFs from R2 through the S3 SDK. Same account, same credentials, same billing, same dashboard we already check during an incident. Adding Google Drive meant a second provider, a second service account, and a second thing to be wrong at 3am.

**R2 has zero egress fees, and that's a reliability feature, not a line item.** Restore rehearsals pull the entire backup down. If every drill has a bandwidth cost attached, drills quietly stop happening — and an unrehearsed backup is a rumour. We wanted the cost of practising to be zero so there's never a reason to skip it.

**Object storage semantics beat file-sync semantics for this job.** S3-style multipart uploads, predictable API rate limits, and a flat key namespace are what an unattended nightly job wants. Drive service accounts bring their own operational texture: daily transfer ceilings, the shared-drive requirement for service accounts, and API quota errors that surface as a failed backup rather than a slow one.

**PBM speaks S3 natively**, so R2 needs configuration, not a translation layer. rclone's S3 backend could in principle point mongopit at R2 — but that's a path the tool wasn't built or tested around, and we'd be maintaining it ourselves.

None of this makes mongopit the wrong choice. If Drive is where your storage budget already lives, or you want something small enough to read end to end in an afternoon, it does the job and it does point-in-time properly. Ours was a storage decision, not a verdict on the tool.

## What actually runs

```
┌──────────── VPS ─────────────┐
│  mongod (rs0, 1 member)      │
│      ▲                       │
│      │ logical read          │
│  pbm-agent ──── full backup daily 20:00 ────┐
│      └───────── oplog slice / 10 min ───────┤
│                              │              ▼
│  host cron                   │      Cloudflare R2
│   ├─ backup  20:00           │      one bucket
│   └─ metrics every 5 min     │      ├── prod/
│         │                    │      └── dev/
│         ▼                    │
│  pbm-metrics.sh              │
│   (pbm status -o json → .prom)
│         │                    │
│         ▼                    │
│  node_exporter → Prometheus → Alertmanager → email
└──────────────────────────────┘
```

## One bucket, two prefixes, one guard

Dev and prod write into the same R2 bucket, separated by a key prefix. One bucket means one token, one lifecycle policy, and one place to look. It also means a misconfigured dev box could write into production's backup path — and, worse, *prune* it, since retention deletes anything older than the window.

So the bootstrap script doesn't trust the config file it just sent. It asks PBM what it actually stored, and refuses to continue if the prefix isn't the one this box is supposed to own:

```bash
applied_prefix="$(pbm_config_value storage.s3.prefix)"
[[ "$applied_prefix" == "$PBM_R2_PREFIX" ]] || die "..."
```

Configuration that verifies itself is the difference between a safety property and a naming convention.

The R2 specifics, for anyone doing the same:

```yaml
storage:
  type: s3
  s3:
    region: auto          # R2's only valid region
    endpointUrl: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
    forcePathStyle: true  # PBM's default; pinned so it stays true
    bucket: prochesta-mongo-backups
    prefix: prod          # or dev
```

## Seven days of snapshots, two days of moments

| | Retention | Granularity |
|---|---|---|
| Full backups | 7 days | one per night at 20:00 |
| Oplog slices | 2 days | every 10 minutes |

Inside two days we can restore to any instant — 14:19:59, one second before the bad write. Beyond that we have nightly snapshots for a week. Corruption discovered on day three costs up to 24 hours of data; corruption discovered within two days costs seconds.

The two windows are coupled in a way that's easy to get wrong. Point-in-time recovery replays oplog slices *on top of a full backup*. If the oplog window were shorter than the interval between backups, the newest snapshot would have no slices behind it and PITR would silently degrade to "restore last night". Our backup script refuses to run if that invariant is ever violated in config.

## The dead man's switch

Percona ships a PBM collector for `mongodb_exporter`. We deliberately didn't use it.

It reports what PBM's own collections say — agent status, backup sizes, transition timestamps. All useful. But consider how a backup system actually fails in production:

- The cron entry gets wiped during a host rebuild.
- The pruning step starts erroring while the backup itself still succeeds.
- Someone runs a restore, which turns PITR off, and nobody re-enables it.

In every one of those cases the exporter keeps reporting a healthy last backup, because the last backup *was* healthy. It just happened eleven days ago.

Instead, one script parses `pbm status -o json` into a Prometheus textfile every five minutes:

```
prochesta_pbm_metrics_scrape_ts       1754337900
prochesta_pbm_last_backup_success_ts  1754337005
prochesta_pbm_pitr_last_chunk_ts      1754337600
prochesta_pbm_agents_ok               1
```

That first timestamp is the whole idea. If the monitoring itself dies, the value stops moving and `PBMMetricsStale` fires within fifteen minutes:

```yaml
- alert: PBMMetricsStale
  expr: absent(prochesta_pbm_metrics_scrape_ts)
        or (time() - prochesta_pbm_metrics_scrape_ts) > 900
  for: 10m
```

Without it, a dead cron job is indistinguishable from a healthy system: no errors, no alerts, no backups. The runbook says to check that alert first, because while it's firing every other backup metric is frozen at a stale value and telling you nothing about now.

**The script always writes its file — especially when everything is broken.** If PBM is unreachable it writes `prochesta_pbm_up 0` and moves on. Going silent on failure would be the one behaviour that defeats the entire purpose.

Twelve rules sit on top of those metrics. The one we expect to earn its keep least often is the most interesting: `PBMBackupSizeCollapsed` fires when a backup succeeds but comes in at under half its seven-day average — the shape of a backup that completed and is missing most of the data.

## Two traps in the restore path

A logical restore can't run against a cluster that's being written to. So restores are a downtime event, and the script owns that explicitly: it stops the API container, restores, and brings it back on *every* exit path — a failed restore must not also leave the site down.

The second trap is nastier. **A restore turns PITR off**, and the restored state has no full backup behind it. Point-in-time coverage is gone, but `pbm status` still cheerfully lists all the older backups, so nothing looks wrong. Re-enabling PITR and taking a fresh base backup is therefore built into the restore script as its final step, not written down as something an operator is expected to remember at the end of an incident.

## Four things that broke

Everything above validated cleanly — compose files parsed, `promtool` passed, the metrics parser was tested against fixtures built from PBM's own source. Then we ran it on a real box.

**1. The deploy started an agent that couldn't authenticate.** Our deploy script ends with `docker compose up -d --wait`. On a box that had never been through backup setup, that started `pbm-agent` with an empty password. It failed its healthcheck, went unhealthy, and failed the entire deploy — on a host that simply wasn't using backups yet. Fix: put the backup services behind a compose profile so the default service set excludes them entirely.

**2. Setup succeeded without doing anything.** The setup script preserved existing values in `.env`, which is correct for passwords and wrong for a feature flag. With `PBM_ENABLED=false` already set, every subsequent step no-opped, the verification backup exited zero without backing anything up, and the closing report announced that backups were configured. Running the setup script *is* the request to enable backups, so it now forces that value.

**3. PBM returns config values in brackets.** Our prefix guard compared `pbm config storage.s3.bucket` against the expected name. PBM 2.15 returns `[storage.s3.bucket=prochesta-mongo-backups]`, not a bare value, so the comparison never matched and bootstrap aborted on a box where the configuration had applied perfectly. The same bad parse silently reset PITR on every run.

**4. The restore prompted into a pipe.** `pbm restore` asks "Are you sure?" before dispatching. We invoke it through `docker compose exec -T`, which allocates no TTY, so it died with `Error: no tty` — after our script had already stopped the API. The confirmation happens before the restore is dispatched, so nothing was touched, but our error message claimed the database was "in whatever state the restore reached". The fix is one flag. The lesson is that a restore path you have never executed is not a restore path.

## Why 517 MB of database is a 75 MB backup

The first production backup came in at 74.98 MB against a data directory of 517 MB, which is exactly the kind of number that makes you want to verify before trusting. It decomposes cleanly:

| Component | Size | In a logical backup? |
|---|---:|---|
| WiredTiger journal | 201 MB | No |
| Oplog (`local` db) | 120 MB | No |
| Diagnostic data | 8.8 MB | No |
| Collections + indexes on disk | 184 MB | Documents only |
| **Data directory total** | **517 MB** | **→ 74.98 MB shipped** |

A logical backup carries documents, not storage. Indexes are rebuilt at restore time from their definitions rather than copied. The journal and oplog are working state. What remains is BSON compressed with s2 — and 184 MB of on-disk collections and indexes reducing to 75 MB is precisely what you'd expect.

Arithmetic like this rules out the blunt failure — a backup that ran and captured almost nothing. It proves nothing about whether the backup restores.

## What we haven't solved

**Automated restore verification doesn't exist yet.** Nothing on a schedule restores the latest backup into a throwaway instance and asserts that collection counts match. Until that exists, every backup is unproven except the ones a human has personally drilled. This is the single highest-value thing left, and `PBMBackupSizeCollapsed` is a deliberately crude stand-in for it.

**The backups share the application's R2 credentials.** Anything holding that key — including the running API container — can delete every backup, and R2 offers no object versioning or object lock to fall back on. We took this knowingly to limit secret sprawl, and built the seam for the fix: dedicated `PBM_R2_*` keys take precedence over the shared ones, so moving to a bucket-scoped token is three lines of config and no code change. Naming the risk in the spec isn't the same as removing it.

**Two days of point-in-time is short.** Corruption noticed on day three falls back to a nightly snapshot. Widening it costs only R2 storage — we start narrow and widen when something teaches us to.

## Design for the failure you'll actually have

The interesting decisions here weren't about backup software. They were about which failure we believed would happen.

We assumed the cron would silently stop long before we assumed the disk would die, so we built a dead man's switch before we built a second storage region. We assumed someone would eventually run a restore against the wrong environment, so the prefix guard aborts rather than warns. We assumed drills would stop happening if they had a cost, so we chose storage with zero egress.

Every one of the four rollout bugs was in the operational scaffolding — the deploy interaction, the flag handling, the output parsing, the TTY — and not one was in the backup engine. That's where these systems break, and it's why "we configured backups" and "we have backups" are different sentences.

---

*Built at [Prochesta](https://prochesta.app/) — an exam preparation platform for students in Bangladesh, with model tests, live exams, friendly battles and performance tracking. The infrastructure above is what keeps their attempt history, results and subscriptions safe.*

*And if Google Drive is where your backups belong, take a look at [mongopit](https://github.com/takiuddinahmed/mongopit) — self-hosted MongoDB point-in-time recovery, oplog replay and GFS retention, in one Compose service.*
