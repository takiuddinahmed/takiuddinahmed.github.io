// Dark mode toggle
const darkSwitch = document.getElementById("darkSwitch");
const html = document.documentElement;

// Check for saved theme preference or prefer-color-scheme
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Set initial theme
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  html.setAttribute("data-theme", "dark");
  darkSwitch.checked = true;
} else {
  html.removeAttribute("data-theme");
  darkSwitch.checked = false;
}

// Handle theme toggle
darkSwitch.addEventListener("change", function () {
  if (this.checked) {
    html.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    html.removeAttribute("data-theme");
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
  // --- Chat Widget Logic ---
  const chatOpenBtn = document.getElementById("chat-open-btn");
  const chatPopup = document.getElementById("chat-popup");
  const chatCloseBtn = document.getElementById("chat-close-btn");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  // Toggle popup
  function openChat() {
    chatPopup.classList.remove("invisible", "opacity-0", "pointer-events-none");
    chatPopup.classList.add("visible", "opacity-100");
    setTimeout(() => chatInput.focus(), 300);
  }
  function closeChat() {
    chatPopup.classList.add("invisible", "opacity-0", "pointer-events-none");
    chatPopup.classList.remove("visible", "opacity-100");
  }
  if (chatOpenBtn && chatPopup && chatCloseBtn) {
    chatOpenBtn.addEventListener("click", openChat);
    chatCloseBtn.addEventListener("click", closeChat);
  }

  // Add message to chat
  function addMessage(text, from) {
    const msgDiv = document.createElement("div");
    msgDiv.className = from === "user" ? "text-right" : "text-left";
    msgDiv.innerHTML = `<span class="inline-block px-3 py-2 rounded-lg ${
      from === "user"
        ? "bg-primary-600 text-white"
        : "bg-slate-200 dark:bg-dark-border text-gray-800 dark:text-gray-100"
    } max-w-[75%]">${text}</span>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle send
  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const prompt = chatInput.value.trim();
      if (!prompt) return;
      addMessage(prompt, "user");
      chatInput.value = "";
      addMessage("<i class='fas fa-spinner fa-spin'></i> ...", "bot");
      try {
        const res = await fetch("http://34.41.18.95/chatbot/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        // Remove spinner
        chatMessages.lastChild.remove();
        if (data && data.answer) {
          addMessage(data.answer, "bot");
        } else {
          addMessage("Sorry, I didn't get a valid response.", "bot");
        }
      } catch (err) {
        chatMessages.lastChild.remove();
        addMessage("Error connecting to chatbot API.", "bot");
      }
    });
  }
  // Optional: open with Enter if focused on button
  if (chatOpenBtn) {
    chatOpenBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openChat();
    });
  }
  // Optional: close with Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeChat();
  });
  // --- End Chat Widget Logic ---

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
