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

// Mobile Menu Toggle

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
let isMenuOpen = false;

mobileMenuBtn.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;
  if (isMenuOpen) {
    mobileMenu.style.height = mobileMenu.scrollHeight + "px";
    mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
  } else {
    mobileMenu.style.height = "0";
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
  }
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll("a");
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.style.height = "0";
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    isMenuOpen = false;
  });
});

// Theme Toggle
document.addEventListener("DOMContentLoaded", () => {
  // Check for saved theme preference, otherwise use system preference
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Theme toggle button functionality
  const darkSwitch = document.getElementById("darkSwitch");
  if (darkSwitch) {
    darkSwitch.addEventListener("click", () => {
      // Toggle theme
      document.documentElement.classList.toggle("dark");

      // Save preference
      if (document.documentElement.classList.contains("dark")) {
        localStorage.theme = "dark";
      } else {
        localStorage.theme = "light";
      }
    });
  }
});
