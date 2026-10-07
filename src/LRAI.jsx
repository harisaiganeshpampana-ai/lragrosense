import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Apps from "./Apps";

import {
  ArrowUp,
  ChevronDown,
  Folder,
  Grid2X2,
  Leaf,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const STORAGE_KEY = "lr-ai-conversations-v1";

const CANVA_API_BASE =
  "https://lragrosense.onrender.com";

const CANVA_SESSION_KEY =
  "lr-ai-canva-session-v1";

const exploreItems = [
  {
    title: "Identify a plant",
    prompt:
      "Identify this plant and tell me the important information about it.",
  },
  {
    title: "Check plant disease",
    prompt:
      "Check this plant for possible diseases and explain what you observe.",
  },
  {
    title: "Check symptoms",
    prompt:
      "Analyze these plant symptoms and explain the possible causes.",
  },
  {
    title: "Nutrient problems",
    prompt:
      "Could these symptoms be related to a nutrient deficiency? Explain the possibilities.",
  },
  {
    title: "Crop health",
    prompt:
      "Give me a complete crop health assessment based on the information I provide.",
  },
  {
    title: "Pest problems",
    prompt:
      "Could this plant have pest damage? Explain what signs I should look for.",
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
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
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

    reader.onload = () =>
      resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function getCanvaClientSession() {
  try {
    let session =
      localStorage.getItem(
        CANVA_SESSION_KEY
      );

    if (
      !session ||
      session.length < 32
    ) {
      session =
        crypto
          .randomUUID()
          .replace(/-/g, "");

      localStorage.setItem(
        CANVA_SESSION_KEY,
        session
      );
    }

    return session;
  } catch {
    return crypto
      .randomUUID()
      .replace(/-/g, "");
  }
}

export default function LRAI() {
  const [
    conversations,
    setConversations,
  ] = useState(loadConversations);

  const [
    activeChatId,
    setActiveChatId,
  ] = useState(null);

  const [
    input,
    setInput,
  ] = useState("");

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    exploreOpen,
    setExploreOpen,
  ] = useState(false);

  const [
    projectsOpen,
    setProjectsOpen,
  ] = useState(true);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    appsOpen,
    setAppsOpen,
  ] = useState(false);

  const [
    plusMenuOpen,
    setPlusMenuOpen,
  ] = useState(false);

  const [
    connectorsOpen,
    setConnectorsOpen,
  ] = useState(false);

  const [
    canvaConnected,
    setCanvaConnected,
  ] = useState(false);

  const [
    canvaStatusLoading,
    setCanvaStatusLoading,
  ] = useState(false);

  const textareaRef =
    useRef(null);

  const imageInputRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const composerMenuRef =
    useRef(null);

  const activeChat =
    conversations.find(
      (chat) =>
        chat.id === activeChatId
    ) || null;

  useEffect(() => {
    saveConversations(
      conversations
    );
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    activeChat?.messages,
    loading,
  ]);

  useEffect(() => {
    if (
      !activeChatId &&
      conversations.length > 0
    ) {
      setActiveChatId(
        conversations[0].id
      );
    }
  }, [
    activeChatId,
    conversations,
  ]);

  /*
   * CANVA STATUS
   */

  const checkCanvaStatus =
    async () => {
      setCanvaStatusLoading(true);

      try {
        const clientSession =
          getCanvaClientSession();

        const response =
          await fetch(
            `${CANVA_API_BASE}/api/apps/canva/status?client_session=${encodeURIComponent(
              clientSession
            )}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Could not check Canva status."
          );
        }

        const data =
          await response.json();

        setCanvaConnected(
          Boolean(data?.connected)
        );
      } catch (error) {
        console.error(
          "Canva status error:",
          error
        );

        setCanvaConnected(false);
      } finally {
        setCanvaStatusLoading(false);
      }
    };

  /*
   * CANVA STATUS ON LOAD
   */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const canvaResult =
      params.get("canva");

    const callbackSession =
      params.get("client_session");

    /*
     * If Canva returned a client session,
     * make sure this browser remembers it.
     */
    if (
      callbackSession &&
      callbackSession.length >= 32
    ) {
      try {
        localStorage.setItem(
          CANVA_SESSION_KEY,
          callbackSession
        );
      } catch {
        // Ignore storage errors.
      }
    }

    if (
      canvaResult === "connected"
    ) {
      setCanvaConnected(true);
      setPlusMenuOpen(true);
      setConnectorsOpen(true);

      params.delete("canva");
      params.delete("client_session");

      const cleanQuery =
        params.toString();

      window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname}${
          cleanQuery
            ? `?${cleanQuery}`
            : ""
        }${window.location.hash}`
      );

      setTimeout(() => {
        checkCanvaStatus();
      }, 300);

      return;
    }

    if (
      canvaResult === "error"
    ) {
      params.delete("canva");
      params.delete("client_session");

      const cleanQuery =
        params.toString();

      window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname}${
          cleanQuery
            ? `?${cleanQuery}`
            : ""
        }${window.location.hash}`
      );

      setCanvaConnected(false);

      console.error(
        "Canva connection failed."
      );
    }

    checkCanvaStatus();
  }, []);

  /*
   * CLOSE MENU WHEN CLICKING OUTSIDE
   */

  useEffect(() => {
    const handleOutsideClick =
      (event) => {
        if (
          composerMenuRef.current &&
          !composerMenuRef.current.contains(
            event.target
          )
        ) {
          setPlusMenuOpen(false);
          setConnectorsOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * START CANVA CONNECTION
   */

  const startCanvaConnection =
    () => {
      const clientSession =
        getCanvaClientSession();

      const connectUrl =
        `${CANVA_API_BASE}/api/apps/canva/connect?client_session=${encodeURIComponent(
          clientSession
        )}`;

      window.location.href =
        connectUrl;
    };

  /*
   * DISCONNECT CANVA
   */

  const disconnectCanva =
    async () => {
      setCanvaStatusLoading(true);

      try {
        const clientSession =
          getCanvaClientSession();

        const response =
          await fetch(
            `${CANVA_API_BASE}/api/apps/canva/disconnect`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                client_session:
                  clientSession,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Could not disconnect Canva."
          );
        }

        setCanvaConnected(false);
      } catch (error) {
        console.error(
          "Canva disconnect error:",
          error
        );

        alert(
          "Could not disconnect Canva. Please try again."
        );
      } finally {
        setCanvaStatusLoading(false);
      }
    };

  /*
   * NEW CHAT
   */

  const startNewChat = () => {
    setActiveChatId(null);
    setInput("");
    setSelectedImage(null);
    setImagePreview("");
    setAppsOpen(false);
    setSidebarOpen(false);
    setPlusMenuOpen(false);
    setConnectorsOpen(false);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  /*
   * OPEN CHAT
   */

  const openChat = (id) => {
    setAppsOpen(false);
    setPlusMenuOpen(false);
    setConnectorsOpen(false);
    setActiveChatId(id);
    setSidebarOpen(false);
  };

  /*
   * IMAGE UPLOAD
   */

  const handleImage = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      return;
    }

    if (
      file.size >
      12 * 1024 * 1024
    ) {
      alert(
        "Please choose an image smaller than 12 MB."
      );

      return;
    }

    setSelectedImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  /*
   * REMOVE IMAGE
   */

  const removeSelectedImage =
    () => {
      setSelectedImage(null);
      setImagePreview("");

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    };

  /*
   * UPDATE CHAT
   */

  const updateChat = (
    chatId,
    updater
  ) => {
    setConversations(
      (current) =>
        current.map(
          (chat) =>
            chat.id === chatId
              ? updater(chat)
              : chat
        )
    );
  };

  /*
   * SEND MESSAGE
   */

  const sendMessage =
    async () => {
      const text =
        input.trim();

      if (
        !text &&
        !selectedImage
      ) {
        return;
      }

      let chatId =
        activeChatId;

      let chat =
        activeChat;

      if (!chat) {
        const newChat =
          createConversation();

        chatId = newChat.id;
        chat = newChat;

        setConversations(
          (current) => [
            newChat,
            ...current,
          ]
        );

        setActiveChatId(
          newChat.id
        );
      }

      let imageData = null;

      if (selectedImage) {
        try {
          imageData =
            await fileToDataUrl(
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

      updateChat(
        chatId,
        (current) => ({
          ...current,
          title: nextTitle,
          updatedAt: Date.now(),
          messages: [
            ...current.messages,
            userMessage,
          ],
        })
      );

      setInput("");
      removeSelectedImage();
      setLoading(true);

      try {
        const apiBase = (
          import.meta.env
            .VITE_API_BASE_URL ||
          ""
        ).replace(/\/$/, "");

        if (!apiBase) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                600
              )
          );

          const demoMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "LR AI is ready for agricultural analysis, but the secure AI server is not connected yet. Once the backend is connected, I will analyze your plant image and answer your question using the AI model.",
            createdAt: Date.now(),
          };

          updateChat(
            chatId,
            (current) => ({
              ...current,
              updatedAt: Date.now(),
              messages: [
                ...current.messages,
                demoMessage,
              ],
            })
          );

          return;
        }

        const response =
          await fetch(
            `${apiBase}/api/analyze`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                question:
                  text ||
                  "Analyze this plant image.",
                image: imageData,
              }),
            }
          );

        const data =
          await response.json();

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

        updateChat(
          chatId,
          (current) => ({
            ...current,
            updatedAt: Date.now(),
            messages: [
              ...current.messages,
              assistantMessage,
            ],
          })
        );
      } catch (error) {
        const errorMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            error.message ||
            "Something went wrong while connecting to LR AI.",
          createdAt: Date.now(),
        };

        updateChat(
          chatId,
          (current) => ({
            ...current,
            updatedAt: Date.now(),
            messages: [
              ...current.messages,
              errorMessage,
            ],
          })
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * ENTER TO SEND
   */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  /*
   * EXPLORE PROMPT
   */

  const useExplorePrompt =
    (prompt) => {
      setAppsOpen(false);
      setInput(prompt);
      setExploreOpen(false);
      setSidebarOpen(false);
      setPlusMenuOpen(false);
      setConnectorsOpen(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    };

  /*
   * DELETE CHAT
   */

  const deleteChat = (chatId) => {
    setConversations(
      (current) =>
        current.filter(
          (chat) =>
            chat.id !== chatId
        )
    );

    if (
      activeChatId === chatId
    ) {
      setActiveChatId(null);
    }
  };

  /*
   * SEARCH
   */

  const filteredChats =
    searchText.trim()
      ? conversations.filter(
          (chat) =>
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

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close sidebar"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`lr-ai-sidebar ${
          sidebarOpen
            ? "sidebar-visible"
            : ""
        }`}
      >
        <div className="sidebar-top">

          <div className="lr-ai-brand">
            <div className="lr-ai-mark">
              <img
                src="/lr-ai-logo.png"
                alt="LR AI"
              />
            </div>

            <div className="lr-ai-brand-text">
              <strong>
                LR AI
              </strong>

              <span>
                Plant Intelligence
              </span>
            </div>
          </div>

          <button
            className="new-chat-button"
            onClick={
              startNewChat
            }
          >
            <Plus size={18} />
            <span>
              New chat
            </span>
          </button>

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
                aria-label="Close search"
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

          <button
            className="sidebar-action"
            onClick={() =>
              setExploreOpen(
                (value) => !value
              )
            }
          >
            <Sparkles size={17} />

            <span>
              Explore
            </span>

            <ChevronDown
              className={`sidebar-chevron ${
                exploreOpen
                  ? "rotated"
                  : ""
              }`}
              size={15}
            />
          </button>

          {exploreOpen && (
            <div className="explore-menu">
              {exploreItems.map(
                (item) => (
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
                )
              )}
            </div>
          )}

          <button
            className={`sidebar-action ${
              appsOpen
                ? "sidebar-action-active"
                : ""
            }`}
            onClick={() => {
              setAppsOpen(true);
              setExploreOpen(false);
              setSidebarOpen(false);
              setPlusMenuOpen(false);
              setConnectorsOpen(false);
            }}
          >
            <Grid2X2 size={17} />

            <span>
              Apps
            </span>
          </button>

          <button
            className="sidebar-section-title"
            onClick={() =>
              setProjectsOpen(
                (value) => !value
              )
            }
          >
            <span>
              Projects
            </span>

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
                      setAppsOpen(false);

                      setInput(
                        `Let's work on my ${project} project.`
                      );

                      setTimeout(() => {
                        textareaRef.current?.focus();
                      }, 100);
                    }}
                  >
                    <Folder size={16} />

                    <span>
                      {project}
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="recent-section">
          <div className="recent-heading">
            <span>
              Recent
            </span>

            {conversations.length >
              0 && (
              <span className="recent-count">
                {conversations.length}
              </span>
            )}
          </div>

          <div className="recent-list">
            {filteredChats.length ===
            0 ? (
              <div className="empty-recent">
                No conversations yet.
              </div>
            ) : (
              filteredChats.map(
                (chat) => (
                  <div
                    key={chat.id}
                    className={`chat-item ${
                      activeChatId ===
                      chat.id
                        ? "active"
                        : ""
                    }`}
                  >
                    <button
                      className="chat-item-main"
                      onClick={() =>
                        openChat(
                          chat.id
                        )
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
                        deleteChat(
                          chat.id
                        )
                      }
                      title="Delete chat"
                      aria-label="Delete chat"
                    >
                      <MoreHorizontal
                        size={15}
                      />
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="ai-status">
            <span className="status-dot" />

            <div>
              <strong>
                LR AI
              </strong>

              <span>
                Plant intelligence
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="lr-ai-main">

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
            {appsOpen
              ? "Apps"
              : activeChat?.title ||
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

        <div className="chat-area">

          {appsOpen ? (
            <Apps
              onClose={() =>
                setAppsOpen(false)
              }
            />
          ) : !activeChat ||
            activeChat.messages.length ===
              0 ? (

            <div className="welcome-screen">

              <div className="welcome-mark">
                <Sparkles size={25} />
              </div>

              <h1>
                How can LR AI help?
              </h1>

              <p>
                Ask questions about
                plants, crops, diseases,
                pests, soil and
                agricultural problems.
              </p>

              <div className="welcome-suggestions">
                {exploreItems
                  .slice(0, 4)
                  .map(
                    (item) => (
                      <button
                        key={
                          item.title
                        }
                        onClick={() =>
                          useExplorePrompt(
                            item.prompt
                          )
                        }
                      >
                        <Leaf size={15} />

                        {item.title}
                      </button>
                    )
                  )}
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
                          <Sparkles
                            size={15}
                          />
                        )}
                      </div>

                      <div className="message-body">

                        {message.image && (
                          <img
                            src={
                              message.image
                            }
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

        {/* INPUT */}

        {!appsOpen && (
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

              <div
                className="input-box composer-box"
                ref={composerMenuRef}
              >

                {/* PLUS BUTTON */}

                <button
                  className={`attach-button plus-menu-button ${
                    plusMenuOpen
                      ? "plus-menu-button-active"
                      : ""
                  }`}
                  onClick={() => {
                    setPlusMenuOpen(
                      (value) => !value
                    );

                    setConnectorsOpen(false);
                  }}
                  aria-label="Open tools and connectors"
                  title="Add files, tools and connectors"
                  type="button"
                >
                  <Plus size={21} />
                </button>

                {/* IMAGE INPUT */}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />

                {/* PLUS MENU */}

                {plusMenuOpen && (
                  <div className="composer-menu">

                    <button
                      className="composer-menu-item"
                      type="button"
                      onClick={() => {
                        imageInputRef.current?.click();

                        setPlusMenuOpen(false);
                        setConnectorsOpen(false);
                      }}
                    >
                      <span className="composer-menu-icon">
                        📎
                      </span>

                      <span className="composer-menu-label">
                        Add files or photos
                      </span>

                      <span className="composer-menu-shortcut">
                        Ctrl+U
                      </span>
                    </button>

                    <button
                      className="composer-menu-item"
                      type="button"
                    >
                      <Folder size={17} />

                      <span className="composer-menu-label">
                        Add to project
                      </span>

                      <ChevronDown
                        size={15}
                        className="composer-menu-chevron"
                      />
                    </button>

                    <div className="composer-menu-divider" />

                    <button
                      className="composer-menu-item"
                      type="button"
                    >
                      <Sparkles size={17} />

                      <span className="composer-menu-label">
                        Skills
                      </span>

                      <ChevronDown
                        size={15}
                        className="composer-menu-chevron"
                      />
                    </button>

                    {/* CONNECTORS */}

                    <button
                      className={`composer-menu-item ${
                        connectorsOpen
                          ? "composer-menu-item-active"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {
                        setConnectorsOpen(
                          (value) => !value
                        );

                        checkCanvaStatus();
                      }}
                    >
                      <Grid2X2 size={17} />

                      <span className="composer-menu-label">
                        Connectors
                      </span>

                      <ChevronDown
                        size={15}
                        className="composer-menu-chevron"
                      />
                    </button>

                    {/* CONNECTORS SUBMENU */}

                    {connectorsOpen && (
                      <div className="connectors-submenu">

                        <button
                          className="connector-menu-item"
                          type="button"
                          onClick={() => {
                            startCanvaConnection();
                          }}
                        >
                          <Plus size={17} />

                          <span>
                            Add connector
                          </span>

                          <ChevronDown
                            size={15}
                            className="composer-menu-chevron"
                          />
                        </button>

                        <button
                          className="connector-menu-item"
                          type="button"
                          onClick={() => {
                            checkCanvaStatus();
                          }}
                        >
                          <Folder size={17} />

                          <span>
                            Manage connectors
                          </span>
                        </button>

                        <div className="composer-menu-divider" />

                        {/* ONLY REAL CONNECTOR */}

                        <div className="connector-row">

                          <span className="connector-app-icon canva-icon">
                            C
                          </span>

                          <span className="connector-app-name">
                            Canva
                          </span>

                          <button
                            className={`connector-switch ${
                              canvaConnected
                                ? "connector-switch-on"
                                : ""
                            }`}
                            type="button"
                            role="switch"
                            aria-checked={
                              canvaConnected
                            }
                            disabled={
                              canvaStatusLoading
                            }
                            onClick={() => {
                              if (
                                canvaConnected
                              ) {
                                disconnectCanva();
                              } else {
                                startCanvaConnection();
                              }
                            }}
                            aria-label={
                              canvaConnected
                                ? "Disconnect Canva"
                                : "Connect Canva"
                            }
                          >
                            <span />
                          </button>

                        </div>

                      </div>
                    )}

                    <button
                      className="composer-menu-item"
                      type="button"
                    >
                      <Sparkles size={17} />

                      <span className="composer-menu-label">
                        Design system
                      </span>

                      <ChevronDown
                        size={15}
                        className="composer-menu-chevron"
                      />
                    </button>

                    <button
                      className="composer-menu-item"
                      type="button"
                    >
                      <Plus size={17} />

                      <span className="composer-menu-label">
                        Add plugins
                      </span>
                    </button>

                    <div className="composer-menu-divider" />

                    <button
                      className="composer-menu-item"
                      type="button"
                    >
                      <Search size={17} />

                      <span className="composer-menu-label">
                        Web search
                      </span>

                      <span className="composer-menu-check">
                        ✓
                      </span>
                    </button>

                    <button
                      className="composer-menu-item"
                      type="button"
                    >
                      <MessageSquare size={17} />

                      <span className="composer-menu-label">
                        Memory
                      </span>

                      <span className="composer-menu-check">
                        ✓
                      </span>
                    </button>

                  </div>
                )}

                {/* TEXTAREA */}

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

                {/* SEND */}

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
                LR AI can make mistakes.
                Verify important
                agricultural decisions
                with appropriate testing
                or an agricultural
                professional.
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
