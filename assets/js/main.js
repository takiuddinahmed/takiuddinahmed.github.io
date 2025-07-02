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

  // --- Chat Widget Logic ---
  document.querySelectorAll(".chat-trigger").forEach((btn) => {
    btn.addEventListener("click", openChat);
  });

  const chatPopup = document.getElementById("chat-popup");
  const chatCloseBtn = document.getElementById("chat-close-btn");
  const chatMaximizeBtn = document.getElementById("chat-maximize-btn");
  const chatMinimizeBtn = document.getElementById("chat-minimize-btn");
  const maximizeIcon = document.getElementById("maximize-icon");
  const minimizeIcon = document.getElementById("minimize-icon");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  // Toggle popup
  function openChat() {
    // Always open in minimized state
    chatPopup.setAttribute("data-maximized", "false");
    chatPopup.className = chatPopup.getAttribute("data-default-class");
    chatMaximizeBtn.classList.remove("hidden");
    chatMinimizeBtn.classList.add("hidden");
    chatPopup.classList.remove("invisible", "opacity-0", "pointer-events-none");
    chatPopup.classList.add("visible", "opacity-100");
    setTimeout(() => chatInput.focus(), 300);
  }
  function closeChat() {
    chatPopup.classList.add("invisible", "opacity-0", "pointer-events-none");
    chatPopup.classList.remove("visible", "opacity-100");
  }
  if (chatPopup && chatCloseBtn) {
    chatCloseBtn.addEventListener("click", closeChat);
  }

  // Maximize
  if (chatPopup && chatMaximizeBtn) {
    chatMaximizeBtn.addEventListener("click", function () {
      chatPopup.setAttribute("data-maximized", "true");
      chatPopup.className = chatPopup.getAttribute("data-maximized-class");
      chatMaximizeBtn.classList.add("hidden");
      chatMinimizeBtn.classList.remove("hidden");
      // Ensure chat input is visible
      chatForm.classList.remove("hidden");
      // Scroll to bottom
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 100);
    });
  }
  // Minimize
  if (chatPopup && chatMinimizeBtn) {
    chatMinimizeBtn.addEventListener("click", function () {
      chatPopup.setAttribute("data-maximized", "false");
      chatPopup.className = chatPopup.getAttribute("data-default-class");
      chatMaximizeBtn.classList.remove("hidden");
      chatMinimizeBtn.classList.add("hidden");
      // Ensure chat input is visible
      chatForm.classList.remove("hidden");
      // Scroll to bottom
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 100);
    });
  }

  // Add message to chat
  let conversationId = null;
  // const apiUrl = "https://ask-api.takiuddin.me/chatbot/ask";
  const apiUrl = "http://localhost:3000/chatbot/ask";
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
        // conversationId থাকলে সেটাও পাঠাবে
        const body = { prompt };
        if (conversationId) {
          body.conversationId = conversationId;
        }
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        // Remove spinner
        chatMessages.lastChild.remove();
        if (data && data.answer) {
          addMessage(data.answer, "bot");
          // conversationId সংরক্ষণ
          if (data.conversationId) {
            conversationId = data.conversationId;
          }
        } else {
          addMessage("Sorry, I didn't get a valid response.", "bot");
        }
      } catch (err) {
        chatMessages.lastChild.remove();
        addMessage("Error connecting to chatbot API.", "bot");
      }
    });
  }

  // close with Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeChat();
  });
  // --- End Chat Widget Logic ---
});
