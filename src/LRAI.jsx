import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Camera,
  ChevronDown,
  Folder,
  Leaf,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";

const STORAGE_KEY = "lr-ai-conversations-v1";

const exploreItems = [
  {
    title: "Identify a plant",
    prompt: "Identify this plant and tell me the important information about it.",
  },
  {
    title: "Check plant disease",
    prompt: "Check this plant for possible diseases and explain what you observe.",
  },
  {
    title: "Check symptoms",
    prompt: "Analyze these plant symptoms and explain the possible causes.",
  },
  {
    title: "Nutrient problems",
    prompt: "Could these symptoms be related to a nutrient deficiency? Explain the possibilities.",
  },
  {
    title: "Crop health",
    prompt: "Give me a complete crop health assessment based on the information I provide.",
  },
  {
    title: "Pest problems",
    prompt: "Could this plant have pest damage? Explain what signs I should look for.",
  },
];

const defaultProjects = [
  "My Farm",
  "Crop Research",
];

function createConversation() {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };
}

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversations)
    );
  } catch {
    // Ignore local storage errors.
  }
}

function makeTitle(text) {
  const cleaned = text
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "New chat";
  }

  return cleaned.length > 42
    ? `${cleaned.slice(0, 42)}...`
    : cleaned;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function LRAI() {
  const [conversations, setConversations] = useState(
    loadConversations
  );

  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeChat =
    conversations.find(
      (chat) => chat.id === activeChatId
    ) || null;

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat?.messages, loading]);

  useEffect(() => {
    if (!activeChatId && conversations.length > 0) {
      setActiveChatId(conversations[0].id);
    }
  }, [activeChatId, conversations]);

  const startNewChat = () => {
    setActiveChatId(null);
    setInput("");
    setSelectedImage(null);
    setImagePreview("");
    setSidebarOpen(false);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const openChat = (id) => {
    setActiveChatId(id);
    setSidebarOpen(false);
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      alert("Please choose an image smaller than 12 MB.");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const updateChat = (chatId, updater) => {
    setConversations((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? updater(chat)
          : chat
      )
    );
  };

  const sendMessage = async () => {
    const text = input.trim();

    if (!text && !selectedImage) {
      return;
    }

    let chatId = activeChatId;
    let chat = activeChat;

    if (!chat) {
      const newChat = createConversation();

      chatId = newChat.id;
      chat = newChat;

      setConversations((current) => [
        newChat,
        ...current,
      ]);

      setActiveChatId(newChat.id);
    }

    let imageData = null;

    if (selectedImage) {
      try {
        imageData = await fileToDataUrl(
          selectedImage
        );
      } catch {
        return;
      }
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content:
        text ||
        "Please analyze this plant image.",
      image: imageData,
      createdAt: Date.now(),
    };

    const nextTitle =
      chat.title === "New chat"
        ? makeTitle(
            text ||
              "Plant image analysis"
          )
        : chat.title;

    updateChat(chatId, (current) => ({
      ...current,
      title: nextTitle,
      updatedAt: Date.now(),
      messages: [
        ...current.messages,
        userMessage,
      ],
    }));

    setInput("");
    removeSelectedImage();
    setLoading(true);

    try {
      /*
       * The secure backend will be connected here.
       *
       * The Gemini API key must NEVER be placed
       * inside this frontend application.
       */

      const apiBase = (
        import.meta.env.VITE_API_BASE_URL || ""
      ).replace(/\/$/, "");

      if (!apiBase) {
        await new Promise((resolve) =>
          setTimeout(resolve, 600)
        );

        const demoMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "LR AI is ready for agricultural analysis, but the secure AI server is not connected yet. Once the backend is connected, I will analyze your plant image and answer your question using the AI model.",
          createdAt: Date.now(),
        };

        updateChat(chatId, (current) => ({
          ...current,
          updatedAt: Date.now(),
          messages: [
            ...current.messages,
            demoMessage,
          ],
        }));

        return;
      }

      const response = await fetch(
        `${apiBase}/api/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question:
              text ||
              "Analyze this plant image.",
            image: imageData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "LR AI could not process the request."
        );
      }

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.answer ||
          "I could not generate an answer.",
        createdAt: Date.now(),
      };

      updateChat(chatId, (current) => ({
        ...current,
        updatedAt: Date.now(),
        messages: [
          ...current.messages,
          assistantMessage,
        ],
      }));
    } catch (error) {
      const errorMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          error.message ||
          "Something went wrong while connecting to LR AI.",
        createdAt: Date.now(),
      };

      updateChat(chatId, (current) => ({
        ...current,
        updatedAt: Date.now(),
        messages: [
          ...current.messages,
          errorMessage,
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  const useExplorePrompt = (prompt) => {
    setInput(prompt);
    setExploreOpen(false);
    setSidebarOpen(false);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const deleteChat = (chatId) => {
    setConversations((current) =>
      current.filter(
        (chat) => chat.id !== chatId
      )
    );

    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const filteredChats =
    searchText.trim()
      ? conversations.filter((chat) =>
          chat.title
            .toLowerCase()
            .includes(
              searchText
                .toLowerCase()
                .trim()
            )
        )
      : conversations;

  return (
    <div className="lr-ai-app">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close sidebar"
        />
      )}

      {/* ==================================================
          SIDEBAR
          ================================================== */}

      <aside
        className={`lr-ai-sidebar ${
          sidebarOpen ? "sidebar-visible" : ""
        }`}
      >

        <div className="sidebar-top">

          {/* BRAND */}

          <div className="lr-ai-brand">
            <div className="lr-ai-mark">
              <img
                src="/lr-ai-logo.png"
                alt="LR AI"
              />
            </div>

            <div className="lr-ai-brand-text">
              <strong>LR AI</strong>
              <span>Plant Intelligence</span>
            </div>
          </div>

          {/* NEW CHAT */}

          <button
            className="new-chat-button"
            onClick={startNewChat}
          >
            <Plus size={18} />
            <span>New chat</span>
          </button>

          {/* SEARCH */}

          {searchOpen && (
            <div className="chat-search">
              <Search size={15} />

              <input
                autoFocus
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
                placeholder="Search chats"
              />

              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchText("");
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {!searchOpen && (
            <button
              className="sidebar-action"
              onClick={() =>
                setSearchOpen(true)
              }
            >
              <Search size={17} />
              Search
            </button>
          )}

          {/* EXPLORE */}

          <button
            className="sidebar-action"
            onClick={() =>
              setExploreOpen(
                (value) => !value
              )
            }
          >
            <Sparkles size={17} />

            <span>Explore</span>

            <ChevronDown
              className={`sidebar-chevron ${
                exploreOpen ? "rotated" : ""
              }`}
              size={15}
            />
          </button>

          {exploreOpen && (
            <div className="explore-menu">

              {exploreItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() =>
                    useExplorePrompt(
                      item.prompt
                    )
                  }
                >
                  <Leaf size={14} />
                  {item.title}
                </button>
              ))}

            </div>
          )}

          {/* PROJECTS */}

          <button
            className="sidebar-section-title"
            onClick={() =>
              setProjectsOpen(
                (value) => !value
              )
            }
          >
            <span>Projects</span>

            <ChevronDown
              size={14}
              className={
                projectsOpen
                  ? "rotated"
                  : ""
              }
            />
          </button>

          {projectsOpen && (
            <div className="projects-list">

              {defaultProjects.map(
                (project) => (
                  <button
                    key={project}
                    className="project-item"
                    onClick={() => {
                      setInput(
                        `Let's work on my ${project} project.`
                      );

                      setTimeout(() => {
                        textareaRef.current?.focus();
                      }, 100);
                    }}
                  >
                    <Folder size={16} />
                    <span>{project}</span>
                  </button>
                )
              )}

            </div>
          )}

        </div>

        {/* RECENT */}

        <div className="recent-section">

          <div className="recent-heading">
            <span>Recent</span>

            {conversations.length > 0 && (
              <span className="recent-count">
                {conversations.length}
              </span>
            )}
          </div>

          <div className="recent-list">

            {filteredChats.length === 0 ? (
              <div className="empty-recent">
                No conversations yet.
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${
                    activeChatId === chat.id
                      ? "active"
                      : ""
                  }`}
                >

                  <button
                    className="chat-item-main"
                    onClick={() =>
                      openChat(chat.id)
                    }
                  >
                    <MessageSquare
                      size={15}
                    />

                    <span>
                      {chat.title}
                    </span>
                  </button>

                  <button
                    className="chat-more"
                    onClick={() =>
                      deleteChat(chat.id)
                    }
                    title="Delete chat"
                  >
                    <MoreHorizontal
                      size={15}
                    />
                  </button>

                </div>
              ))
            )}

          </div>

        </div>

        {/* SIDEBAR FOOTER */}

        <div className="sidebar-footer">

          <div className="ai-status">
            <span className="status-dot" />

            <div>
              <strong>LR AI</strong>
              <span>Plant intelligence</span>
            </div>
          </div>

        </div>

      </aside>

      {/* ==================================================
          MAIN
          ================================================== */}

      <main className="lr-ai-main">

        {/* TOP BAR */}

        <header className="lr-ai-topbar">

          <button
            className="mobile-sidebar-button"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open sidebar"
          >
            <Menu size={21} />
          </button>

          <div className="mobile-page-title">
            {activeChat?.title ||
              "LR AI"}
          </div>

          <div className="topbar-right">

            <a
              href="https://lragrosense.in"
              className="back-company"
            >
              LR AgroSense
            </a>

          </div>

        </header>

        {/* ==================================================
            CHAT
            ================================================== */}

        <div className="chat-area">

          {!activeChat ||
          activeChat.messages.length === 0 ? (
            <div className="welcome-screen">

              <div className="welcome-mark">
                <Sparkles size={25} />
              </div>

              <h1>
                How can LR AI help?
              </h1>

              <p>
                Ask questions about plants,
                crops, diseases, pests, soil
                and agricultural problems.
              </p>

              <div className="welcome-suggestions">

                {exploreItems
                  .slice(0, 4)
                  .map((item) => (
                    <button
                      key={item.title}
                      onClick={() =>
                        useExplorePrompt(
                          item.prompt
                        )
                      }
                    >
                      <Leaf size={15} />
                      {item.title}
                    </button>
                  ))}

              </div>

            </div>
          ) : (
            <div className="messages-container">

              {activeChat.messages.map(
                (message) => (
                  <div
                    key={message.id}
                    className={`message-row ${
                      message.role ===
                      "user"
                        ? "user-message"
                        : "assistant-message"
                    }`}
                  >

                    <div className="message-inner">

                      <div className="message-avatar">
                        {message.role ===
                        "user" ? (
                          "You"
                        ) : (
                          <Sparkles size={15} />
                        )}
                      </div>

                      <div className="message-body">

                        {message.image && (
                          <img
                            src={message.image}
                            alt="Uploaded plant"
                            className="message-image"
                          />
                        )}

                        <div className="message-text">
                          {message.content}
                        </div>

                      </div>

                    </div>

                  </div>
                )
              )}

              {loading && (
                <div className="message-row assistant-message">

                  <div className="message-inner">

                    <div className="message-avatar">
                      <Sparkles size={15} />
                    </div>

                    <div className="typing-indicator">
                      <span />
                      <span />
                      <span />
                    </div>

                  </div>

                </div>
              )}

              <div
                ref={messagesEndRef}
                className="message-end"
              />

            </div>
          )}

        </div>

        {/* ==================================================
            INPUT
            ================================================== */}

        <div className="input-area">

          <div className="input-container">

            {imagePreview && (
              <div className="image-attachment">

                <img
                  src={imagePreview}
                  alt="Selected plant"
                />

                <button
                  onClick={
                    removeSelectedImage
                  }
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>

              </div>
            )}

            <div className="input-box">

              <button
                className="attach-button"
                onClick={() =>
                  imageInputRef.current?.click()
                }
                aria-label="Upload image"
                title="Upload plant image"
              >
                <Camera size={20} />
              </button>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Message LR AI..."
                rows={1}
              />

              <button
                className="send-button"
                onClick={sendMessage}
                disabled={
                  loading ||
                  (!input.trim() &&
                    !selectedImage)
                }
                aria-label="Send message"
              >
                <ArrowUp size={18} />
              </button>

            </div>

            <div className="input-disclaimer">
              LR AI can make mistakes. Verify important
              agricultural decisions with appropriate
              testing or an agricultural professional.
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
