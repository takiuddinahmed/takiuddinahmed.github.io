document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".chat-trigger").forEach((btn) => {
    btn.addEventListener("click", openChat);
  });

  const chatPopup = document.getElementById("chat-popup");
  const chatCloseBtn = document.getElementById("chat-close-btn");
  const chatMaximizeBtn = document.getElementById("chat-maximize-btn");
  const chatMinimizeBtn = document.getElementById("chat-minimize-btn");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  // Sidebar open/close animation
  function openChat() {
    chatPopup.setAttribute("data-maximized", "false");
    chatPopup.classList.remove("invisible", "opacity-0", "pointer-events-none");
    chatPopup.classList.add("visible", "opacity-100");
    chatPopup.style.transition =
      "right 0.5s cubic-bezier(.4,2,.6,1), width 0.4s cubic-bezier(.4,2,.6,1), border-radius 0.4s, opacity 0.3s";
    chatPopup.style.right = "-500px";
    chatPopup.style.left = "auto";
    chatPopup.style.width = "450px";
    chatPopup.style.maxWidth = "100vw";
    chatPopup.style.height = "100vh";
    chatPopup.style.top = "0";
    chatPopup.style.bottom = "0";
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
    requestAnimationFrame(() => {
      chatPopup.style.right = "0";
    });
    setTimeout(() => chatInput.focus(), 500);
  }
  function closeChat() {
    chatPopup.style.right = "-500px";
    setTimeout(() => {
      chatPopup.classList.add("invisible", "opacity-0", "pointer-events-none");
      chatPopup.classList.remove("visible", "opacity-100");
      chatPopup.style.display = "none";
    }, 500);
  }
  if (chatPopup && chatCloseBtn) {
    chatCloseBtn.addEventListener("click", closeChat);
  }

  // Maximize
  if (chatPopup && chatMaximizeBtn) {
    chatMaximizeBtn.addEventListener("click", function () {
      chatPopup.setAttribute("data-maximized", "true");
      chatPopup.style.transition =
        "right 0.4s cubic-bezier(.4,2,.6,1), width 0.4s cubic-bezier(.4,2,.6,1), border-radius 0.4s, opacity 0.3s";
      chatPopup.style.width = "calc(100vw - 16px)";
      chatPopup.style.right = "0";
      chatPopup.style.left = "0";
      chatPopup.style.marginLeft = "0";
      chatPopup.style.transform = "none";
      chatPopup.style.borderRadius = "0";
      chatPopup.style.height = "100vh";
      chatPopup.style.top = "0";
      chatPopup.style.bottom = "0";
      chatMaximizeBtn.classList.add("hidden");
      chatMinimizeBtn.classList.remove("hidden");
      chatForm.classList.remove("hidden");
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 400);
    });
  }
  // Minimize
  if (chatPopup && chatMinimizeBtn) {
    chatMinimizeBtn.addEventListener("click", function () {
      chatPopup.setAttribute("data-maximized", "false");
      chatPopup.style.transition =
        "right 0.4s cubic-bezier(.4,2,.6,1), width 0.4s cubic-bezier(.4,2,.6,1), border-radius 0.4s, opacity 0.3s";
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
      }, 400);
    });
  }

  // Add message to chat
  let conversationId = null;
  const apiUrl = "http://localhost:3000/chatbot/ask";
  function addMessage(text, from, isLoading = false) {
    const msgWrapper = document.createElement("div");
    msgWrapper.className = `flex ${
      from === "user" ? "justify-end" : "justify-start"
    } px-2`;

    const bubble = document.createElement("div");

    // Common bubble styles
    bubble.className = `
    inline-flex items-center gap-2 px-4 py-2 max-w-[80%] md:max-w-[70%] break-words
    rounded-xl shadow-sm text-sm leading-relaxed
    ${
      from === "user"
        ? "bg-primary-600 text-white rounded-br-none"
        : "bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-100 rounded-bl-none"
    }
  `
      .replace(/\s+/g, " ")
      .trim();

    if (isLoading) {
      bubble.innerHTML = `
      <span class="loader w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></span>
      <span>Thinking...</span>
    `;
    } else {
      bubble.textContent = text;
    }

    msgWrapper.appendChild(bubble);
    chatMessages.appendChild(msgWrapper);
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
});
