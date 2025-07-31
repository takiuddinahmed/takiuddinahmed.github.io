document.addEventListener("DOMContentLoaded", function () {
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
});
