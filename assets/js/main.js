// Dark mode toggle
const darkSwitch = document.getElementById("darkSwitch");
const html = document.documentElement;

// Check for saved theme preference or prefer-color-scheme
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Set initial theme
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  html.classList.add("dark");
  darkSwitch.checked = true;
}

// Handle theme toggle
darkSwitch.addEventListener("change", function () {
  if (this.checked) {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// Initialize GitHub calendar and activity feed
document.addEventListener("DOMContentLoaded", function () {
  // GitHub Calendar
  GitHubCalendar("#github-graph", "takiuddinahmed", {
    responsive: true,
    tooltips: true,
  });

  // GitHub Activity Feed
  GitHubActivity.feed({
    username: "takiuddinahmed",
    selector: "#ghfeed",
    limit: 10,
  });

  // Fix GitHub activity feed layout after it's loaded
  // Update your fixGitHubFeed function
  const fixGitHubFeed = () => {
    const feed = document.querySelector(".gha-feed");
    if (feed) {
      const header = feed.querySelector(".gha-header");
      const footer = feed.querySelector(".gha-footer");
      const activities = feed.querySelector(".gha-activities");

      if (header && footer && activities) {
        // Create body container if it doesn't exist
        let body = feed.querySelector(".gha-body");
        if (!body) {
          body = document.createElement("div");
          body.className = "gha-body";

          // Insert elements in correct order
          header.after(body);
          body.appendChild(activities);
          body.after(footer);
        }

        // Ensure proper styling
        feed.style.height = "600px"; // Set a fixed height for the container
        body.style.overflowY = "auto";
        body.style.minHeight = "0"; // Important for Firefox
      }
    }
  };

  // Try to fix the feed structure periodically until successful
  const feedObserver = new MutationObserver((mutations) => {
    if (document.querySelector(".gha-feed")) {
      fixGitHubFeed();
    }
  });

  feedObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also try with a timeout as backup
  setTimeout(fixGitHubFeed, 1000);
  setTimeout(fixGitHubFeed, 2000);

  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll(".skill-progress");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.classList.toString().match(/w-\[(\d+)%\]/)[1];
          bar.style.width = `${width}%`;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => observer.observe(bar));
});
