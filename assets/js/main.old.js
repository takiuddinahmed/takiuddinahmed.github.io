"use strict";

//Enable tooltips everywhere
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

/* Vanilla RSS - https://github.com/sdepold/vanilla-rss */

const rss = new RSS(
  document.querySelector("#rss-feeds"),
  //Change this to your own rss feeds
  "https://feeds.feedburner.com/TechCrunch/startups",
  {
    // how many entries do you want?
    // default: 4
    // valid values: any integer
    limit: 3,

    // will request the API via https
    // default: false
    // valid values: false, true
    ssl: true,

    // outer template for the html transformation
    // default: "<ul>{entries}</ul>"
    // valid values: any string
    layoutTemplate: "<div class='items'>{entries}</div>",

    // inner template for each entry
    // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
    // valid values: any string
    entryTemplate:
      '<div class="item"><h3 class="title"><a href="{url}" target="_blank">{title}</a></h3><div><p>{shortBodyPlain}</p><a class="more-link" href="{url}" target="_blank"><i class="fas fa-external-link-alt"></i>Read more</a></div></div>',
  }
);
rss.render();

/* Github Calendar - https://github.com/IonicaBizau/github-calendar */
new GitHubCalendar("#github-graph", "takiuddinahmed", { responsive: true });

/* Github Activity Feed - https://github.com/caseyscarborough/github-activity */
GitHubActivity.feed({ username: "takiuddinahmed", selector: "#ghfeed" });

document.addEventListener("DOMContentLoaded", function () {
  // Dark mode toggle
  const darkSwitch = document.getElementById("darkSwitch");
  const html = document.documentElement;

  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    html.classList.toggle("dark", savedTheme === "dark");
    darkSwitch.checked = savedTheme === "dark";
  } else {
    html.classList.toggle("dark", prefersDarkMode);
    darkSwitch.checked = prefersDarkMode;
  }

  darkSwitch.addEventListener("change", function () {
    if (this.checked) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  // GitHub Calendar
  try {
    GitHubCalendar("#github-graph", "takiuddinahmed", {
      responsive: true,
      theme: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    });
  } catch (error) {
    console.error("Failed to load GitHub calendar:", error);
  }

  // GitHub Activity
  try {
    GitHubActivity.feed({
      username: "takiuddinahmed",
      selector: "#ghfeed",
      limit: 10,
      footer: true,
    });
  } catch (error) {
    console.error("Failed to load GitHub activity:", error);
  }

  // Update GitHub calendar theme on dark mode change
  darkSwitch.addEventListener("change", function () {
    try {
      GitHubCalendar("#github-graph", "takiuddinahmed", {
        responsive: true,
        theme: this.checked ? "dark" : "light",
      });
    } catch (error) {
      console.error("Failed to update GitHub calendar theme:", error);
    }
  });
});
