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

  // Sidebar open/close animation
  function openChat() {
    chatPopup.setAttribute("data-maximized", "false");
    chatPopup.classList.remove("invisible", "opacity-0", "pointer-events-none");
    chatPopup.classList.add("visible", "opacity-100");
    // Sidebar style: slide in from right, always fully on screen
    chatPopup.style.right = "0";
    chatPopup.style.left = "auto";
    chatPopup.style.transition =
      "right 0.4s cubic-bezier(.4,2,.6,1), opacity 0.3s";
    chatPopup.style.width = "450px";
    chatPopup.style.maxWidth = "100vw";
    chatPopup.style.height = "100vh";
    chatPopup.style.top = "0";
    chatPopup.style.bottom = "0";
    chatPopup.style.left = "unset";
    chatPopup.style.borderRadius = "0.75rem 0 0 0.75rem";
    chatPopup.style.boxShadow = "-2px 0 24px 0 rgba(0,0,0,0.10)";
    chatPopup.style.background = chatPopup.classList.contains("dark")
      ? "#18181b"
      : "#fff";
    chatPopup.style.display = "flex";
    chatPopup.style.flexDirection = "column";
    chatPopup.style.position = "fixed";
    chatPopup.style.zIndex = 9999;
    chatMaximizeBtn.classList.remove("hidden");
    chatMinimizeBtn.classList.add("hidden");
    setTimeout(() => chatInput.focus(), 300);
  }
  function closeChat() {
    // Sidebar style: slide out to right
    chatPopup.style.right = "-400px";
    chatPopup.style.left = "auto";
    chatPopup.style.transition =
      "right 0.4s cubic-bezier(.4,2,.6,1), opacity 0.3s";
    setTimeout(() => {
      chatPopup.classList.add("invisible", "opacity-0", "pointer-events-none");
      chatPopup.classList.remove("visible", "opacity-100");
      chatPopup.style.display = "none";
    }, 400);
  }
  if (chatPopup && chatCloseBtn) {
    chatCloseBtn.addEventListener("click", closeChat);
  }

  // Maximize
  if (chatPopup && chatMaximizeBtn) {
    chatMaximizeBtn.addEventListener("click", function () {
      chatPopup.setAttribute("data-maximized", "true");
      chatPopup.style.width = "100vw";
      chatPopup.style.right = "0";
      chatPopup.style.left = "0";
      chatPopup.style.borderRadius = "0";
      chatPopup.style.height = "100vh";
      chatPopup.style.top = "0";
      chatPopup.style.bottom = "0";
      chatMaximizeBtn.classList.add("hidden");
      chatMinimizeBtn.classList.remove("hidden");
      chatForm.classList.remove("hidden");
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 100);
    });
  }
  // Minimize
  if (chatPopup && chatMinimizeBtn) {
    chatMinimizeBtn.addEventListener("click", function () {
      chatPopup.setAttribute("data-maximized", "false");
      chatPopup.style.width = "450px";
      chatPopup.style.right = "0";
      chatPopup.style.left = "auto";
      chatPopup.style.borderRadius = "0.75rem 0 0 0.75rem";
      chatPopup.style.height = "100vh";
      chatPopup.style.top = "0";
      chatPopup.style.bottom = "0";
      chatMaximizeBtn.classList.remove("hidden");
      chatMinimizeBtn.classList.add("hidden");
      chatForm.classList.remove("hidden");
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 100);
    });
  }

  // Add message to chat
  let conversationId = null;
  // const apiUrl = "https://ask-api.takiuddin.me/chatbot/ask";
  const apiUrl = "http://localhost:3000/chatbot/ask";
  function addMessage(text, from, isLoading = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = from === "user" ? "text-right" : "text-left";
    if (isLoading) {
      msgDiv.innerHTML = `<span class="inline-block px-3 py-2 rounded-lg bg-slate-200 dark:bg-dark-border text-gray-800 dark:text-gray-100 max-w-[75%] flex items-center gap-2"><span class='loader'></span> <span>Thinking...</span></span>`;
    } else {
      msgDiv.innerHTML = `<span class="inline-block px-3 py-2 rounded-lg ${
        from === "user"
          ? "bg-primary-600 text-white"
          : "bg-slate-200 dark:bg-dark-border text-gray-800 dark:text-gray-100"
      } max-w-[75%]">${text}</span>`;
    }
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
      addMessage("", "bot", true); // Show loader
      try {
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
        // Remove loader
        chatMessages.lastChild.remove();
        if (data && data.answer) {
          addMessage(data.answer, "bot");
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
