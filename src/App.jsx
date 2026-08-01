import { useState, useRef, useEffect } from "react";

const BOW = (size = 20, color = "#E85C8A") => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 12C12 12 9 6 4 6C2 6 1 8 1 9.5C1 11.5 3 12 4 12C3 12 1 12.5 1 14.5C1 16 2 18 4 18C9 18 12 12 12 12Z"
      fill={color}
    />
    <path
      d="M12 12C12 12 15 6 20 6C22 6 23 8 23 9.5C23 11.5 21 12 20 12C21 12 23 12.5 23 14.5C23 16 22 18 20 18C15 18 12 12 12 12Z"
      fill={color}
    />
    <circle cx="12" cy="12" r="2.4" fill={color} />
  </svg>
);

const PawDivider = () => (
  <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "18px 0" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#E8A9C4",
          opacity: 0.3 + i * 0.25,
        }}
      />
    ))}
  </div>
);

const CHANNEL_NAME = "kitty_chat_broadcast_v2";
const GLOBAL_MSGS_KEY = "kitty_chat_all_messages_v2";
const REGISTERED_USERS_KEY = "kitty_chat_registered_users_v2";

const AVATAR_COLORS = [
  "#FF8FAB",
  "#E85C8A",
  "#B388FF",
  "#FF80AB",
  "#82B1FF",
  "#80D8FF",
  "#A7FFEB",
  "#F8BBD0",
];

const getAvatarColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export default function KittyChat() {
  const [screen, setScreen] = useState("auth"); // auth | onboard | chat
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  // Registered Users Registry
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [onlinePings, setOnlinePings] = useState(new Map());

  // Messages & Active Chat Target ("global" or user email)
  const [activeTarget, setActiveTarget] = useState("global"); // "global" | userEmail
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showUsersPanel, setShowUsersPanel] = useState(false);

  const scrollRef = useRef(null);
  const channelRef = useRef(null);

  // Load registered users list
  const loadRegisteredUsers = () => {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const registerUserInStore = (userObj) => {
    const list = loadRegisteredUsers();
    const existingIdx = list.findIndex((u) => u.email === userObj.email);
    let updated;
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = { ...updated[existingIdx], ...userObj };
    } else {
      updated = [...list, userObj];
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
    setRegisteredUsers(updated);
    channelRef.current?.postMessage({ type: "USERS_UPDATED", payload: updated });
    return updated;
  };

  // Load all messages
  const loadAllMessages = () => {
    try {
      const raw = localStorage.getItem(GLOBAL_MSGS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveAllMessages = (newMsgs) => {
    try {
      localStorage.setItem(GLOBAL_MSGS_KEY, JSON.stringify(newMsgs));
    } catch (e) {
      console.error("Failed to save messages", e);
    }
  };

  // Scroll on message updates
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeTarget]);

  // Initial load
  useEffect(() => {
    setRegisteredUsers(loadRegisteredUsers());
    setMessages(loadAllMessages());
  }, []);

  // BroadcastChannel for Real-time Messaging & Presence & User Registry Sync
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === "NEW_MESSAGE") {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.id)) return prev;
          return [...prev, payload];
        });
      } else if (type === "PRESENCE_PING") {
        if (payload?.email) {
          setOnlinePings((prev) => {
            const next = new Map(prev);
            next.set(payload.email.toLowerCase(), Date.now());
            return next;
          });
        }
      } else if (type === "USERS_UPDATED") {
        setRegisteredUsers(payload || []);
      } else if (type === "CLEAR_CHAT") {
        setMessages([]);
      }
    };

    // Presence Heartbeat
    const interval = setInterval(() => {
      if (email && username) {
        channel.postMessage({
          type: "PRESENCE_PING",
          payload: { email: email.toLowerCase(), username },
        });
      }
      // Prune inactive pings (> 6 sec)
      setOnlinePings((prev) => {
        const now = Date.now();
        const next = new Map();
        prev.forEach((lastSeen, uEmail) => {
          if (now - lastSeen < 6000) {
            next.set(uEmail, lastSeen);
          }
        });
        return next;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [email, username]);

  const validEmail = (v) => Boolean(v && v.trim().length > 0);

  const handleContinue = async () => {
    setError("");
    if (!validEmail(email)) {
      setError("Please enter an email or name to continue.");
      return;
    }
    setChecking(true);
    const lowEmail = email.toLowerCase();
    try {
      const users = loadRegisteredUsers();
      const found = users.find((u) => u.email === lowEmail);
      if (found) {
        setUsername(found.username);
        setMessages(loadAllMessages());
        setScreen("chat");
      } else {
        setScreen("onboard");
      }
    } catch {
      setScreen("onboard");
    } finally {
      setChecking(false);
    }
  };

  const handleCreateAccount = async () => {
    setError("");
    if (!username.trim()) {
      setError("Pick a username, cutie.");
      return;
    }
    setChecking(true);
    const lowEmail = email.toLowerCase();
    const newUser = {
      email: lowEmail,
      username: username.trim(),
      registeredAt: Date.now(),
    };
    try {
      registerUserInStore(newUser);
      setMessages(loadAllMessages());
      setScreen("chat");
    } catch {
      setError("Couldn't create your account, try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = () => {
    setScreen("auth");
    setEmail("");
    setUsername("");
    setInput("");
    setError("");
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const newMsg = {
      id: Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      senderEmail: email.toLowerCase(),
      senderUsername: username,
      recipientTarget: activeTarget, // "global" or specific user's email
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      saveAllMessages(updated);
      return updated;
    });

    channelRef.current?.postMessage({
      type: "NEW_MESSAGE",
      payload: newMsg,
    });
  };

  const clearChat = () => {
    setMessages([]);
    saveAllMessages([]);
    channelRef.current?.postMessage({ type: "CLEAR_CHAT" });
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Filter messages for current active channel/chat target
  const filteredMessages = messages.filter((m) => {
    if (activeTarget === "global") {
      return !m.recipientTarget || m.recipientTarget === "global";
    } else {
      const myEmail = email.toLowerCase();
      const targetEmail = activeTarget.toLowerCase();
      // Message between me and target user
      return (
        (m.senderEmail === myEmail && m.recipientTarget === targetEmail) ||
        (m.senderEmail === targetEmail && m.recipientTarget === myEmail)
      );
    }
  });

  // Calculate unread count per user target
  const getUnreadCount = (targetEmail) => {
    const myEmail = email.toLowerCase();
    return messages.filter(
      (m) =>
        m.senderEmail === targetEmail &&
        m.recipientTarget === myEmail &&
        activeTarget !== targetEmail
    ).length;
  };

  const isUserOnline = (userEmail) => {
    if (userEmail === email.toLowerCase()) return true;
    return onlinePings.has(userEmail.toLowerCase());
  };

  const otherRegisteredUsers = registeredUsers.filter(
    (u) => u.email !== email.toLowerCase()
  );

  const activeTargetUserObj =
    activeTarget === "global"
      ? null
      : registeredUsers.find((u) => u.email === activeTarget.toLowerCase());

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(180deg, #FFF8FB 0%, #FDEDF3 100%)",
      fontFamily: "'Quicksand', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      boxSizing: "border-box",
    },
    card: {
      width: "100%",
      maxWidth: 420,
      background: "#FFFFFF",
      borderRadius: 28,
      boxShadow: "0 20px 50px -12px rgba(232,92,138,0.25)",
      padding: "36px 32px",
      boxSizing: "border-box",
    },
    title: {
      fontFamily: "'Fredoka', sans-serif",
      fontSize: 28,
      color: "#4A3B47",
      textAlign: "center",
      margin: "10px 0 4px",
      fontWeight: 600,
    },
    subtitle: {
      textAlign: "center",
      color: "#B48A9C",
      fontSize: 14,
      marginBottom: 20,
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: 16,
      border: "2px solid #F6D9E4",
      fontSize: 15,
      fontFamily: "'Quicksand', sans-serif",
      outline: "none",
      boxSizing: "border-box",
      marginBottom: 12,
      color: "#4A3B47",
      background: "#FFFBFD",
    },
    button: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: 16,
      border: "none",
      background: "linear-gradient(135deg, #FF8FAB, #E85C8A)",
      color: "white",
      fontFamily: "'Fredoka', sans-serif",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 8px 20px -6px rgba(232,92,138,0.6)",
    },
    error: {
      color: "#D9436A",
      fontSize: 13,
      textAlign: "center",
      marginTop: -4,
      marginBottom: 12,
    },
  };

  // AUTH / ONBOARD SCREENS
  if (screen !== "chat") {
    return (
      <div style={styles.page}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap');
          input:focus { border-color: #E85C8A !important; }
          button:active { transform: scale(0.98); }
        `}</style>
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "center" }}>{BOW(44)}</div>
          <div style={styles.title}>{screen === "auth" ? "Kitty Chat" : "Almost there!"}</div>
          <div style={styles.subtitle}>
            {screen === "auth"
              ? "Register or sign in with email to chat with friends"
              : "Pick your username to complete registration"}
          </div>

          {screen === "auth" && (
            <>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              />
              {error && <div style={styles.error}>{error}</div>}
              <button style={styles.button} onClick={handleContinue} disabled={checking}>
                {checking ? "Checking..." : "Continue"}
              </button>
            </>
          )}

          {screen === "onboard" && (
            <>
              <div
                style={{
                  ...styles.input,
                  background: "#FBEEF3",
                  color: "#B48A9C",
                  marginBottom: 12,
                }}
              >
                {email}
              </div>
              <input
                style={styles.input}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateAccount()}
                autoFocus
              />
              {error && <div style={styles.error}>{error}</div>}
              <button style={styles.button} onClick={handleCreateAccount} disabled={checking}>
                {checking ? "Registering..." : "Register & Chat"}
              </button>
            </>
          )}
          <PawDivider />
        </div>
      </div>
    );
  }

  // MAIN CHAT INTERFACE
  return (
    <div style={{ ...styles.page, alignItems: "stretch", padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap');
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #F0C4D6; border-radius: 10px; }
        .user-item:hover { background: #FFF0F5 !important; }
      `}</style>
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "#FFFFFF",
          boxShadow: "0 0 40px rgba(232, 92, 138, 0.15)",
        }}
      >
        {/* Main Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            background: "#FFFFFF",
            borderBottom: "2px solid #FBEBF1",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {BOW(26)}
            <div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "#4A3B47", fontWeight: 600 }}>
                {activeTarget === "global"
                  ? "🎀 Everyone (Global)"
                  : `💬 1-on-1: ${activeTargetUserObj?.username || activeTarget}`}
              </div>
              <div style={{ fontSize: 12, color: "#C79AB0", display: "flex", alignItems: "center", gap: 6 }}>
                <span>Signed in as <strong>{username}</strong></span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setShowUsersPanel(!showUsersPanel)}
              style={{
                border: "none",
                background: showUsersPanel ? "#E85C8A" : "#FBEEF3",
                color: showUsersPanel ? "#FFFFFF" : "#B4577A",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: 12,
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              👥 Registered ({registeredUsers.length})
            </button>
            <button
              onClick={handleLogout}
              style={{
                border: "none",
                background: "#FFF0F4",
                color: "#D9436A",
                borderRadius: 12,
                padding: "8px 10px",
                fontSize: 12,
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Registered Users & Navigation Bar / Panel */}
        <div
          style={{
            background: "#FFF8FA",
            borderBottom: "2px solid #FBEBF1",
            padding: "10px 14px",
          }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#B4577A", marginBottom: 8 }}>
            SELECT WHO TO TALK TO:
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {/* Global Room Button */}
            <button
              onClick={() => setActiveTarget("global")}
              style={{
                border: activeTarget === "global" ? "2px solid #E85C8A" : "1.5px solid #F6D9E4",
                background: activeTarget === "global" ? "#FFE6EE" : "#FFFFFF",
                color: "#4A3B47",
                borderRadius: 16,
                padding: "6px 12px",
                fontSize: 12.5,
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: activeTarget === "global" ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: activeTarget === "global" ? "0 3px 10px rgba(232,92,138,0.2)" : "none",
              }}
            >
              <span>🎀 Everyone</span>
              <span style={{ fontSize: 10, background: "#E85C8A", color: "#fff", padding: "1px 6px", borderRadius: 10 }}>
                Group
              </span>
            </button>

            {/* List of Registered Users */}
            {otherRegisteredUsers.map((u) => {
              const online = isUserOnline(u.email);
              const unread = getUnreadCount(u.email);
              const isSelected = activeTarget.toLowerCase() === u.email.toLowerCase();
              return (
                <button
                  key={u.email}
                  onClick={() => setActiveTarget(u.email)}
                  style={{
                    border: isSelected ? "2px solid #E85C8A" : "1.5px solid #F6D9E4",
                    background: isSelected ? "#FFE6EE" : "#FFFFFF",
                    color: "#4A3B47",
                    borderRadius: 16,
                    padding: "6px 12px",
                    fontSize: 12.5,
                    fontFamily: "'Quicksand', sans-serif",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: isSelected ? "0 3px 10px rgba(232,92,138,0.2)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: online ? "#2ECC71" : "#BDC3C7",
                    }}
                  />
                  <span>{u.username}</span>
                  {unread > 0 && (
                    <span
                      style={{
                        background: "#D9436A",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Full Registered Users Directory Panel */}
        {showUsersPanel && (
          <div
            style={{
              background: "#FFFBFD",
              borderBottom: "2px solid #FBEBF1",
              padding: 14,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4A3B47" }}>
                All Registered Users ({registeredUsers.length})
              </span>
              <button
                onClick={clearChat}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#D9436A",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear all chat history
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {registeredUsers.map((u) => {
                const online = isUserOnline(u.email);
                const isMe = u.email === email.toLowerCase();
                const avatarBg = getAvatarColor(u.username);
                return (
                  <div
                    key={u.email}
                    onClick={() => {
                      if (!isMe) setActiveTarget(u.email);
                      setShowUsersPanel(false);
                    }}
                    className="user-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: 12,
                      background: activeTarget.toLowerCase() === u.email ? "#FFE6EE" : "#FFFFFF",
                      border: "1px solid #F6D9E4",
                      cursor: isMe ? "default" : "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: avatarBg,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#4A3B47" }}>
                          {u.username} {isMe && "(You)"}
                        </div>
                        <div style={{ fontSize: 10.5, color: "#B48A9C" }}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: online ? "#27AE60" : "#95A5A6" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: online ? "#27AE60" : "#BDC3C7" }} />
                      {online ? "Online" : "Offline"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tip / Banner for testing */}
        <div
          style={{
            background: "#FFF5F8",
            borderBottom: "1px dashed #F6CEFC",
            padding: "6px 14px",
            fontSize: 11,
            color: "#A46682",
            textAlign: "center",
          }}
        >
          💡 Open a <strong>new browser window/tab</strong> with a different email to register another user!
        </div>

        {/* Chat Messages Feed */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "#FAF4F7",
          }}
        >
          {filteredMessages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#C79AB0",
                marginTop: 40,
                fontSize: 14,
              }}
            >
              {BOW(36, "#F0C4D6")}
              <div style={{ marginTop: 12, fontFamily: "'Fredoka', sans-serif", fontSize: 16 }}>
                {activeTarget === "global"
                  ? "Welcome to Everyone Chat! 🎀"
                  : `No messages with ${activeTargetUserObj?.username || activeTarget} yet!`}
              </div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>
                Type a message below to start talking! 🐾
              </div>
            </div>
          ) : (
            filteredMessages.map((m) => {
              const isMe = m.senderEmail === email.toLowerCase();
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  {!isMe && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#B4577A",
                        marginBottom: 3,
                        paddingLeft: 4,
                      }}
                    >
                      🎀 {m.senderUsername}
                    </div>
                  )}
                  <div
                    style={{
                      background: isMe
                        ? "linear-gradient(135deg, #FF8FAB, #E85C8A)"
                        : "#FFFFFF",
                      color: isMe ? "#FFFFFF" : "#4A3B47",
                      padding: "12px 16px",
                      borderRadius: isMe
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      fontSize: 14.5,
                      lineHeight: 1.5,
                      boxShadow: "0 4px 14px -6px rgba(232,92,138,0.2)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.content}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#C79AB0",
                      marginTop: 3,
                      padding: isMe ? "0 4px 0 0" : "0 0 0 4px",
                    }}
                  >
                    {formatTime(m.timestamp)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: 14, background: "#FFFFFF", borderTop: "2px solid #FBEBF1" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{
                flex: 1,
                padding: "13px 16px",
                borderRadius: 20,
                border: "2px solid #F6D9E4",
                outline: "none",
                fontSize: 14.5,
                fontFamily: "'Quicksand', sans-serif",
                color: "#4A3B47",
                background: "#FFFBFD",
              }}
              placeholder={
                activeTarget === "global"
                  ? "Message Everyone..."
                  : `Message ${activeTargetUserObj?.username || activeTarget}...`
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(135deg, #FF8FAB, #E85C8A)",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(232, 92, 138, 0.4)",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
