document.addEventListener("DOMContentLoaded", () => {
  let conversationId = null;
  const apiInitUrl = "http://localhost:3000/chatbot/init";
  const apiChatUrl = "http://localhost:3000/chatbot/ask";

  const userInfoModal = document.getElementById("user-info-modal");
  const userInfoForm = document.getElementById("user-info-form");
  const chatPopup = document.getElementById("chat-popup");
  const chatCloseBtn = document.getElementById("chat-close-btn");
  const chatMaximizeBtn = document.getElementById("chat-maximize-btn");
  const chatMinimizeBtn = document.getElementById("chat-minimize-btn");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const chatAreaUnified = document.getElementById("chat-area-unified");

  const chatContentWrapper = document.createElement("div");
  chatContentWrapper.className = "flex-1 flex flex-col w-full h-full";
  chatAreaUnified.parentNode.insertBefore(chatContentWrapper, chatAreaUnified);
  chatContentWrapper.appendChild(chatAreaUnified);

  // Modal close functionality
  function closeModal() {
    userInfoModal.classList.add("hidden");
  }

  // Open modal or open chat based on conversationId
  document.querySelectorAll(".chat-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("conversationId", conversationId);
      if (conversationId) {
        openChat();
      } else {
        userInfoModal.classList.remove("hidden");
      }
    });
  });

  // Close modal when clicking outside
  userInfoModal.addEventListener("click", (e) => {
    if (e.target === userInfoModal) {
      closeModal();
    }
  });

  // Prevent modal from closing when clicking inside the modal content
  userInfoModal.querySelector("div").addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // ESC key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!userInfoModal.classList.contains("hidden")) {
        closeModal();
      } else {
        closeChat();
      }
    }
  });

  userInfoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();

    if (!name || !email) return alert("Please enter your name and email.");

    try {
      const res = await fetch(apiInitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data?.conversationId) {
        conversationId = data.conversationId;
        userInfoForm.reset();
        closeModal();
        openChat();
      } else {
        alert("Failed to initialize chat.");
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  });

  function openChat() {
    chatPopup.setAttribute("data-maximized", "false");
    chatPopup.classList.remove("invisible", "opacity-0", "pointer-events-none");
    chatPopup.classList.add("visible", "opacity-100");
    chatPopup.style.transition = "all 0.3s ease";
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

    chatContentWrapper.classList.remove("max-w-4xl", "mx-auto");
    chatAreaUnified.classList.remove("chat-area-maximized");

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

  if (chatCloseBtn) chatCloseBtn.addEventListener("click", closeChat);

  if (chatMaximizeBtn) {
    chatMaximizeBtn.addEventListener("click", () => {
      chatPopup.setAttribute("data-maximized", "true");
      chatPopup.style.transition = "all 0.5s ease";
      chatPopup.style.width = "calc(100vw - 16px)";
      chatPopup.style.right = "0";
      chatPopup.style.left = "0";
      chatPopup.style.marginLeft = "0";
      chatPopup.style.transform = "none";
      chatPopup.style.borderRadius = "0";
      chatPopup.style.height = "100vh";
      chatPopup.style.top = "0";
      chatPopup.style.bottom = "0";

      chatContentWrapper.classList.add("max-w-4xl", "mx-auto");
      chatAreaUnified.classList.add("chat-area-maximized");

      chatMaximizeBtn.classList.add("hidden");
      chatMinimizeBtn.classList.remove("hidden");
      chatForm.classList.remove("hidden");

      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 400);
    });
  }

  if (chatMinimizeBtn) {
    chatMinimizeBtn.addEventListener("click", () => {
      chatPopup.setAttribute("data-maximized", "false");
      chatPopup.style.transition = "all 0.5s ease";
      chatPopup.style.width = "450px";
      chatPopup.style.right = "0";
      chatPopup.style.left = "auto";
      chatPopup.style.borderRadius = "0.75rem 0 0 0.75rem";
      chatPopup.style.height = "100vh";
      chatPopup.style.top = "0";
      chatPopup.style.bottom = "0";

      chatContentWrapper.classList.remove("max-w-4xl", "mx-auto");
      chatAreaUnified.classList.remove("chat-area-maximized");

      chatMaximizeBtn.classList.remove("hidden");
      chatMinimizeBtn.classList.add("hidden");
      chatForm.classList.remove("hidden");

      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 400);
    });
  }

  function addMessage(text, from, isLoading = false) {
    const msgWrapper = document.createElement("div");
    msgWrapper.className = `flex ${
      from === "user" ? "justify-end" : "justify-start"
    } px-2`;

    const bubble = document.createElement("div");
    bubble.className = `
      inline-flex items-center gap-2 px-4 py-2 max-w-[80%] md:max-w-[70%] break-words
      rounded-xl shadow-sm text-sm leading-relaxed
      ${
        from === "user"
          ? "bg-primary-600 text-white rounded-br-none"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700"
      }
    `
      .replace(/\s+/g, " ")
      .trim();

    bubble.innerHTML = isLoading
      ? `<span class="loader w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></span>
         <span>Thinking...</span>`
      : text;

    msgWrapper.appendChild(bubble);
    chatMessages.appendChild(msgWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const prompt = chatInput.value.trim();
      if (!prompt || !conversationId) return;

      addMessage(prompt, "user");
      chatInput.value = "";
      addMessage("", "bot", true);

      try {
        const res = await fetch(apiChatUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, conversationId }),
        });
        const data = await res.json();
        chatMessages.lastChild.remove();

        if (data?.answer) {
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
});
