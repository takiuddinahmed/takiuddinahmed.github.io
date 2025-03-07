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

// Initialize GitHub calendar
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
