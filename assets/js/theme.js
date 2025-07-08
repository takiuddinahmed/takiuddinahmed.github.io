// Theme (Dark/Light) Toggle Script
document.addEventListener("DOMContentLoaded", function () {
  // Check for saved theme preference or prefer-color-scheme
  const darkSwitch = document.getElementById("darkSwitch");
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    html.setAttribute("data-theme", "dark");
    if (darkSwitch) darkSwitch.checked = true;
  } else {
    html.removeAttribute("data-theme");
    if (darkSwitch) darkSwitch.checked = false;
  }

  // Handle theme toggle
  if (darkSwitch) {
    darkSwitch.addEventListener("change", function () {
      if (this.checked) {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // Also support Tailwind's 'dark' class for compatibility
  function updateTailwindDarkClass() {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  updateTailwindDarkClass();

  if (darkSwitch) {
    darkSwitch.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      if (document.documentElement.classList.contains("dark")) {
        localStorage.theme = "dark";
      } else {
        localStorage.theme = "light";
      }
    });
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", updateTailwindDarkClass);
});
