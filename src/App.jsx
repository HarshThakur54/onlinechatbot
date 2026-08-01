import { useState, useRef, useEffect } from "react";

// Hello Kitty Bow SVG with animation support
const BOW = (size = 24, color = "#E85C8A") => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="kitty-bow-animated"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path
      d="M12 12C12 12 9 6 4 6C2 6 1 8 1 9.5C1 11.5 3 12 4 12C3 12 1 12.5 1 14.5C1 16 2 18 4 18C9 18 12 12 12 12Z"
      fill={color}
    />
    <path
      d="M12 12C12 12 15 6 20 6C22 6 23 8 23 9.5C23 11.5 21 12 20 12C21 12 23 12.5 23 14.5C23 16 22 18 20 18C15 18 12 12 12 12Z"
      fill={color}
    />
    <circle cx="12" cy="12" r="2.6" fill="#FFF0F5" stroke={color} strokeWidth="1.2" />
  </svg>
);

// Hello Kitty Face Avatar SVG
const HELLO_KITTY_AVATAR = (size = 36) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    className="kitty-head-bounce"
  >
    {/* Ears */}
    <path d="M 22 36 L 12 15 L 36 24 Z" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 78 36 L 88 15 L 64 24 Z" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" strokeLinejoin="round" />
    {/* Inner Ear pink details */}
    <path d="M 23 34 L 17 21 L 32 26 Z" fill="#FFB7CE" />
    <path d="M 77 34 L 83 21 L 68 26 Z" fill="#FFB7CE" />
    {/* Head shape */}
    <ellipse cx="50" cy="55" rx="42" ry="34" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" />
    {/* Eyes */}
    <ellipse cx="32" cy="54" rx="4" ry="6" fill="#4A3B47" />
    <ellipse cx="68" cy="54" rx="4" ry="6" fill="#4A3B47" />
    {/* Nose */}
    <ellipse cx="50" cy="61" rx="4.5" ry="3.5" fill="#FFD166" stroke="#4A3B47" strokeWidth="1.5" />
    {/* Whiskers */}
    <path d="M 12 50 L 2 48 M 10 56 L 0 56 M 12 62 L 2 64" stroke="#4A3B47" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M 88 50 L 98 48 M 90 56 L 100 56 M 88 62 L 98 64" stroke="#4A3B47" strokeWidth="3.5" strokeLinecap="round" />
    {/* Bow on right ear */}
    <g transform="translate(62, 16) scale(1.2)">
      <path d="M12 12C12 12 9 6 4 6C2 6 1 8 1 9.5C1 11.5 3 12 4 12C3 12 1 12.5 1 14.5C1 16 2 18 4 18C9 18 12 12 12 12Z" fill="#E85C8A" stroke="#4A3B47" strokeWidth="1.5" />
      <path d="M12 12C12 12 15 6 20 6C22 6 23 8 23 9.5C23 11.5 21 12 20 12C21 12 23 12.5 23 14.5C23 16 22 18 20 18C15 18 12 12 12 12Z" fill="#E85C8A" stroke="#4A3B47" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.8" fill="#FFD166" stroke="#4A3B47" strokeWidth="1.5" />
    </g>
  </svg>
);

const PawDivider = () => (
  <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "18px 0" }}>
    {[0, 1, 2, 3].map((i) => (
      <span key={i} className={`paw-pulse paw-pulse-${i}`} style={{ fontSize: 16 }}>
        🐾
      </span>
    ))}
  </div>
);

const CHANNEL_NAME = "kitty_chat_broadcast_v4";
const GLOBAL_MSGS_KEY = "kitty_chat_all_messages_v4";
const REGISTERED_USERS_KEY = "kitty_chat_registered_users_v4";

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
  const [resetToast, setResetToast] = useState(false);

  const scrollRef = useRef(null);
  const channelRef = useRef(null);

  // Helper to load registered users
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

  // Helper to load messages
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

  // Scroll to bottom on message updates
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeTarget]);

  // Initial load + Storage Event listener for cross-tab sync
  useEffect(() => {
    setRegisteredUsers(loadRegisteredUsers());
    setMessages(loadAllMessages());

    const handleStorageChange = (e) => {
      if (e.key === GLOBAL_MSGS_KEY) {
        setMessages(loadAllMessages());
      } else if (e.key === REGISTERED_USERS_KEY) {
        setRegisteredUsers(loadRegisteredUsers());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
          const updated = [...prev, payload];
          saveAllMessages(updated);
          return updated;
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
      } else if (type === "RESET_CHAT") {
        setMessages([]);
        setResetToast(true);
        setTimeout(() => setResetToast(false), 3000);
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

  // Reset Chat Functionality
  const resetChat = () => {
    setMessages([]);
    saveAllMessages([]);
    channelRef.current?.postMessage({ type: "RESET_CHAT" });
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3000);
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
      return (
        (m.senderEmail === myEmail && m.recipientTarget === targetEmail) ||
        (m.senderEmail === targetEmail && m.recipientTarget === myEmail)
      );
    }
  });

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
      background: "linear-gradient(180deg, #FFF0F5 0%, #FCE4EC 50%, #FDEDF3 100%)",
      fontFamily: "'Quicksand', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    },
    card: {
      width: "100%",
      maxWidth: 420,
      background: "#FFFFFF",
      borderRadius: 28,
      boxShadow: "0 20px 50px -12px rgba(232,92,138,0.25)",
      padding: "36px 32px",
      boxSizing: "border-box",
      zIndex: 2,
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

          /* Hello Kitty Animations */
          .kitty-head-bounce {
            animation: kittyBounce 3s ease-in-out infinite;
          }
          @keyframes kittyBounce {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
          }

          .kitty-bow-animated {
            animation: bowPulse 2.5s ease-in-out infinite;
          }
          @keyframes bowPulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            30% { transform: scale(1.15) rotate(-6deg); }
            60% { transform: scale(1.15) rotate(6deg); }
          }

          .paw-pulse { display: inline-block; animation: pawFade 2s infinite ease-in-out; }
          .paw-pulse-0 { animation-delay: 0s; }
          .paw-pulse-1 { animation-delay: 0.3s; }
          .paw-pulse-2 { animation-delay: 0.6s; }
          .paw-pulse-3 { animation-delay: 0.9s; }
          @keyframes pawFade {
            0%, 100% { opacity: 0.3; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          /* Floating Background Bows & Sparkles */
          .bg-float-item {
            position: absolute;
            pointer-events: none;
            opacity: 0.25;
            animation: floatUp 8s linear infinite;
          }
          @keyframes floatUp {
            0% { transform: translateY(105vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.35; }
            80% { opacity: 0.35; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
          }
        `}</style>

        {/* Floating animated Hello Kitty Bows in background */}
        <div className="bg-float-item" style={{ left: "10%", animationDuration: "9s" }}>🎀</div>
        <div className="bg-float-item" style={{ left: "25%", animationDuration: "12s", animationDelay: "2s" }}>✨</div>
        <div className="bg-float-item" style={{ left: "70%", animationDuration: "8s", animationDelay: "1s" }}>💖</div>
        <div className="bg-float-item" style={{ left: "85%", animationDuration: "11s", animationDelay: "3s" }}>🎀</div>
        <div className="bg-float-item" style={{ left: "48%", animationDuration: "10s", animationDelay: "4s" }}>🐾</div>

        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "center" }}>{HELLO_KITTY_AVATAR(68)}</div>
          <div style={styles.title}>{screen === "auth" ? "Pyaru Pyaru Baatee 🎀" : "Almost there!"}</div>
          <div style={styles.subtitle}>
            {screen === "auth"
              ? "Enter your name or email to join the chat"
              : "Pick your username to finish registration"}
          </div>

          {screen === "auth" && (
            <>
              <input
                style={styles.input}
                type="text"
                placeholder="Your email or name..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              />
              {error && <div style={styles.error}>{error}</div>}
              <button style={styles.button} onClick={handleContinue} disabled={checking}>
                {checking ? "Checking..." : "Continue ✨"}
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
                {checking ? "Registering..." : "Join Chat 🎀"}
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

        .kitty-head-bounce {
          animation: kittyBounce 3s ease-in-out infinite;
        }
        @keyframes kittyBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(2deg); }
        }

        .kitty-bow-animated {
          animation: bowPulse 2.5s ease-in-out infinite;
        }
        @keyframes bowPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          30% { transform: scale(1.15) rotate(-6deg); }
          60% { transform: scale(1.15) rotate(6deg); }
        }

        /* Message Bubble Entrance Animation */
        .msg-bubble-animated {
          animation: msgPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes msgPop {
          0% { opacity: 0; transform: scale(0.92) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Toast animation */
        .reset-toast-animated {
          animation: toastSlide 0.3s ease-out;
        }
        @keyframes toastSlide {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
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
          position: "relative",
        }}
      >
        {/* Reset Confirmation Toast Banner */}
        {resetToast && (
          <div
            className="reset-toast-animated"
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #FF8FAB, #E85C8A)",
              color: "#FFFFFF",
              padding: "8px 18px",
              borderRadius: 20,
              fontSize: 13,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              boxShadow: "0 6px 18px rgba(232,92,138,0.4)",
              zIndex: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🧹✨</span> Chat has been reset!
          </div>
        )}

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
            {HELLO_KITTY_AVATAR(36)}
            <div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "#4A3B47", fontWeight: 600 }}>
                {activeTarget === "global"
                  ? "Pyaru Pyaru Baatee 🎀"
                  : `💬 Chat with ${activeTargetUserObj?.username || activeTarget}`}
              </div>
              <div style={{ fontSize: 12, color: "#C79AB0", display: "flex", alignItems: "center", gap: 6 }}>
                <span>hi, <strong>{username}</strong> ✨</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {/* RESET CHAT BUTTON */}
            <button
              onClick={resetChat}
              title="Reset all chat messages"
              style={{
                border: "none",
                background: "#FFE6EE",
                color: "#D9436A",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: 12,
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                boxShadow: "0 2px 6px rgba(217,67,106,0.15)",
              }}
            >
              🔄 Reset Chat
            </button>
            <button
              onClick={() => setShowUsersPanel(!showUsersPanel)}
              style={{
                border: "none",
                background: showUsersPanel ? "#E85C8A" : "#FBEEF3",
                color: showUsersPanel ? "#FFFFFF" : "#B4577A",
                borderRadius: 12,
                padding: "8px 10px",
                fontSize: 12,
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              👥 ({registeredUsers.length})
            </button>
            <button
              onClick={handleLogout}
              style={{
                border: "none",
                background: "#FFF0F4",
                color: "#B4577A",
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

        {/* Registered Users Navigation Bar */}
        <div
          style={{
            background: "#FFF8FA",
            borderBottom: "2px solid #FBEBF1",
            padding: "10px 14px",
          }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#B4577A", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
            {BOW(16)} SELECT ROOM OR FRIEND:
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
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4A3B47" }}>
                All Registered Users ({registeredUsers.length})
              </span>
              <button
                onClick={resetChat}
                style={{
                  border: "none",
                  background: "#FFE6EE",
                  color: "#D9436A",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                🔄 Reset Chat History
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

        {/* How to Chat Instructions */}
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
          💡 Open a <strong>2nd browser tab/window</strong> with a different name to test talking between 2 users!
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
              {HELLO_KITTY_AVATAR(50)}
              <div style={{ marginTop: 12, fontFamily: "'Fredoka', sans-serif", fontSize: 16 }}>
                {activeTarget === "global"
                  ? "Welcome to Pyaru Pyaru Baatee! 🎀"
                  : `No messages with ${activeTargetUserObj?.username || activeTarget} yet!`}
              </div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>
                Type a message below to start talking! ✨🐾
              </div>
            </div>
          ) : (
            filteredMessages.map((m) => {
              const isMe = m.senderEmail === email.toLowerCase();
              return (
                <div
                  key={m.id}
                  className="msg-bubble-animated"
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
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {BOW(14)} {m.senderUsername}
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
                  ? "Message Everyone... 🎀"
                  : `Message ${activeTargetUserObj?.username || activeTarget}... ✨`
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
