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
      <path d="M12 12C12 12 9 6 4 6C2 6 1 8 1 9.5C1 11.5 3 12 4 12C3 12 1 12.5 1 14.5C1 16 2 18 4 18C15 18 12 12 12 12Z" fill="#E85C8A" stroke="#4A3B47" strokeWidth="1.5" />
      <path d="M12 12C12 12 15 6 20 6C22 6 23 8 23 9.5C23 11.5 21 12 20 12C21 12 23 12.5 23 14.5C23 16 22 18 20 18C15 18 12 12 12 12Z" fill="#E85C8A" stroke="#4A3B47" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.8" fill="#FFD166" stroke="#4A3B47" strokeWidth="1.5" />
    </g>
  </svg>
);

// Large Hello Kitty Mascot SVG for Laptop Side Panels
const HELLO_KITTY_MASCOT = ({ wave = false }) => (
  <svg
    width="160"
    height="160"
    viewBox="0 0 120 120"
    fill="none"
    className={wave ? "kitty-waving-mascot" : "kitty-floating-mascot"}
  >
    {/* Body */}
    <ellipse cx="60" cy="95" rx="30" ry="20" fill="#E85C8A" stroke="#4A3B47" strokeWidth="4" />
    <path d="M 45 80 L 35 105 M 75 80 L 85 105" stroke="#4A3B47" strokeWidth="4" strokeLinecap="round" />
    {/* Feet */}
    <ellipse cx="44" cy="110" rx="10" ry="6" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="3" />
    <ellipse cx="76" cy="110" rx="10" ry="6" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="3" />
    {/* Waving Paw */}
    {wave && (
      <g className="waving-hand">
        <ellipse cx="25" cy="78" rx="8" ry="12" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="3" />
        <circle cx="23" cy="72" r="2" fill="#FF8FAB" />
      </g>
    )}
    {/* Ears */}
    <path d="M 28 36 L 16 12 L 44 24 Z" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 92 36 L 104 12 L 76 24 Z" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 29 34 L 21 18 L 39 26 Z" fill="#FFB7CE" />
    <path d="M 91 34 L 99 18 L 81 26 Z" fill="#FFB7CE" />
    {/* Head */}
    <ellipse cx="60" cy="55" rx="46" ry="36" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" />
    {/* Eyes */}
    <ellipse cx="40" cy="54" rx="4.5" ry="7" fill="#4A3B47" />
    <ellipse cx="80" cy="54" rx="4.5" ry="7" fill="#4A3B47" />
    {/* Nose */}
    <ellipse cx="60" cy="62" rx="5" ry="4" fill="#FFD166" stroke="#4A3B47" strokeWidth="1.5" />
    {/* Whiskers */}
    <path d="M 18 50 L 6 48 M 16 56 L 4 56 M 18 62 L 6 64" stroke="#4A3B47" strokeWidth="4" strokeLinecap="round" />
    <path d="M 102 50 L 114 48 M 104 56 L 116 56 M 102 62 L 114 64" stroke="#4A3B47" strokeWidth="4" strokeLinecap="round" />
    {/* Large Bow */}
    <g transform="translate(74, 14) scale(1.5)">
      <path d="M12 12C12 12 9 6 4 6C2 6 1 8 1 9.5C1 11.5 3 12 4 12C3 12 1 12.5 1 14.5C1 16 2 18 4 18C15 18 12 12 12 12Z" fill="#E85C8A" stroke="#4A3B47" strokeWidth="1.5" />
      <path d="M12 12C12 12 15 6 20 6C22 6 23 8 23 9.5C23 11.5 21 12 20 12C21 12 23 12.5 23 14.5C23 16 22 18 20 18C15 18 12 12 12 12Z" fill="#E85C8A" stroke="#4A3B47" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="#FFD166" stroke="#4A3B47" strokeWidth="1.5" />
    </g>
  </svg>
);

// Running Hello Kitty SVG mascot
const RUNNING_HELLO_KITTY = () => (
  <div
    className="running-kitty-sprite"
    style={{
      position: "fixed",
      bottom: "6px",
      zIndex: 3,
      pointerEvents: "none",
    }}
  >
    <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
      {/* Ears */}
      <path d="M 22 36 L 12 15 L 36 24 Z" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" strokeLinejoin="round" />
      <path d="M 78 36 L 88 15 L 64 24 Z" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" strokeLinejoin="round" />
      <path d="M 23 34 L 17 21 L 32 26 Z" fill="#FFB7CE" />
      <path d="M 77 34 L 83 21 L 68 26 Z" fill="#FFB7CE" />
      {/* Body & running paws */}
      <ellipse cx="50" cy="82" rx="22" ry="14" fill="#E85C8A" stroke="#4A3B47" strokeWidth="3" />
      <circle cx="36" cy="94" r="5" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="2.5" />
      <circle cx="64" cy="94" r="5" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="2.5" />
      {/* Head */}
      <ellipse cx="50" cy="55" rx="42" ry="34" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="4" />
      {/* Eyes & Nose */}
      <ellipse cx="32" cy="54" rx="4" ry="6" fill="#4A3B47" />
      <ellipse cx="68" cy="54" rx="4" ry="6" fill="#4A3B47" />
      <ellipse cx="50" cy="61" rx="4.5" ry="3.5" fill="#FFD166" stroke="#4A3B47" strokeWidth="1.5" />
      {/* Whiskers */}
      <path d="M 12 50 L 2 48 M 10 56 L 0 56 M 12 62 L 2 64" stroke="#4A3B47" strokeWidth="3" strokeLinecap="round" />
      <path d="M 88 50 L 98 48 M 90 56 L 100 56 M 88 62 L 98 64" stroke="#4A3B47" strokeWidth="3" strokeLinecap="round" />
      {/* Pink Bow */}
      <g transform="translate(62, 16) scale(1.1)">
        <path d="M12 12C12 12 9 6 4 6C2 6 1 8 1 9.5C1 11.5 3 12 4 12C3 12 1 12.5 1 14.5C1 16 2 18 4 18C15 18 12 12 12 12Z" fill="#E85C8A" stroke="#4A3B47" strokeWidth="1.5" />
        <path d="M12 12C12 12 15 6 20 6C22 6 23 8 23 9.5C23 11.5 21 12 20 12C21 12 23 12.5 23 14.5C23 16 22 18 20 18C15 18 12 12 12 12Z" fill="#E85C8A" stroke="#4A3B47" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.8" fill="#FFD166" stroke="#4A3B47" strokeWidth="1.5" />
      </g>
    </svg>
  </div>
);

// Running Kitty Friend Cat SVG
const RUNNING_CAT = () => (
  <div
    className="running-cat-sprite"
    style={{
      position: "fixed",
      bottom: "18px",
      zIndex: 3,
      pointerEvents: "none",
    }}
  >
    <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
      {/* Tail */}
      <path d="M 15 65 Q 5 40 12 25" stroke="#FF8FAB" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Body */}
      <ellipse cx="50" cy="70" rx="30" ry="18" fill="#FFB7CE" stroke="#4A3B47" strokeWidth="3.5" />
      <circle cx="30" cy="85" r="4.5" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="2" />
      <circle cx="70" cy="85" r="4.5" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="2" />
      {/* Ears */}
      <path d="M 32 45 L 22 25 L 42 34 Z" fill="#FF8FAB" stroke="#4A3B47" strokeWidth="3" />
      <path d="M 68 45 L 78 25 L 58 34 Z" fill="#FF8FAB" stroke="#4A3B47" strokeWidth="3" />
      {/* Head */}
      <circle cx="50" cy="50" r="24" fill="#FFFFFF" stroke="#4A3B47" strokeWidth="3.5" />
      {/* Face details */}
      <ellipse cx="42" cy="48" rx="3" ry="4" fill="#4A3B47" />
      <ellipse cx="58" cy="48" rx="3" ry="4" fill="#4A3B47" />
      <polygon points="50,54 47,51 53,51" fill="#FF8FAB" />
      <path d="M 28 50 L 16 48 M 28 54 L 16 56 M 72 50 L 84 48 M 72 54 L 84 56" stroke="#4A3B47" strokeWidth="2.5" />
    </svg>
  </div>
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

const LOVELY_MESSAGES = [
  "🎀 Spread love & sweetness everywhere you go! ✨",
  "💖 Pyaru Pyaru Baatee — making every conversation special! 🌸",
  "🐾 Soft paws, warm hearts, and sweet conversations! 🎀",
  "✨ You are wonderful just the way you are! 💕",
  "🎀 Happiness is chatting with friends on Pyaru Pyaru Baatee! ✨",
  "🌸 Sending virtual hugs & warm pastel wishes! 💖",
  "✨ Life is sweeter when we share lovely moments together! 🎀",
];

const CHANNEL_NAME = "kitty_chat_broadcast_v10";
const GLOBAL_MSGS_KEY = "kitty_chat_all_messages_v10";
const REGISTERED_USERS_KEY = "kitty_chat_registered_users_v10";
const ACTIVE_SESSION_KEY = "kitty_chat_active_session_v10";

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
  const [screen, setScreen] = useState("auth"); // auth | chat
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Registered Users Registry & Presence map
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [onlinePings, setOnlinePings] = useState(new Map());

  // Messages & Active Chat Target ("global" or user name)
  const [activeTarget, setActiveTarget] = useState("global");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImageModal, setPreviewImageModal] = useState(null);

  const [showUsersPanel, setShowUsersPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [lovelyQuoteIndex, setLovelyQuoteIndex] = useState(0);

  const scrollRef = useRef(null);
  const channelRef = useRef(null);
  const fileInputRef = useRef(null);

  // Rotate lovely banner message every 30 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setLovelyQuoteIndex((prev) => (prev + 1) % LOVELY_MESSAGES.length);
    }, 30000);
    return () => clearInterval(quoteInterval);
  }, []);

  const username = name.trim();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Load registered users from storage
  const loadRegisteredUsers = () => {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Register or update user in storage & broadcast
  const registerUserInStore = (userObj) => {
    const list = loadRegisteredUsers();
    const existingIdx = list.findIndex((u) => u.name.toLowerCase() === userObj.name.toLowerCase());
    let updated;
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = { ...updated[existingIdx], ...userObj, lastActive: Date.now() };
    } else {
      updated = [...list, { ...userObj, lastActive: Date.now() }];
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
    setRegisteredUsers(updated);
    channelRef.current?.postMessage({ type: "USERS_UPDATED", payload: updated });
    return updated;
  };

  // Load messages from storage
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

  // Compress image before saving/sending
  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        setSelectedImage(dataUrl);
      };
    };
  };

  // Scroll to bottom on message updates
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeTarget, selectedImage]);

  // Initial load + Session Auto-Login on Refresh
  useEffect(() => {
    setRegisteredUsers(loadRegisteredUsers());
    setMessages(loadAllMessages());

    try {
      const savedSession = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        if (sessionData?.name) {
          setName(sessionData.name);
          setScreen("chat");
        }
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    }

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

  // BroadcastChannel Instant Bidirectional Handshake Presence & Messaging
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    const sendMyPing = () => {
      if (name) {
        const now = Date.now();
        channel.postMessage({
          type: "PRESENCE_PING",
          payload: { name: name.trim(), timestamp: now },
        });

        // Also update local registered users map with timestamp
        setOnlinePings((prev) => {
          const next = new Map(prev);
          next.set(name.trim().toLowerCase(), now);
          return next;
        });
      }
    };

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
        if (payload?.name) {
          const incomingName = payload.name.trim();
          const incomingKey = incomingName.toLowerCase();
          const incomingTs = payload.timestamp || Date.now();

          setOnlinePings((prev) => {
            const next = new Map(prev);
            next.set(incomingKey, incomingTs);
            return next;
          });

          setRegisteredUsers((prev) => {
            if (!prev.some((u) => u.name.toLowerCase() === incomingKey)) {
              const updated = [
                ...prev,
                { name: incomingName, registeredAt: Date.now(), lastActive: incomingTs },
              ];
              localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
              return updated;
            }
            return prev;
          });

          if (payload.isInitial) {
            sendMyPing();
          }
        }
      } else if (type === "USERS_UPDATED") {
        setRegisteredUsers(payload || []);
      } else if (type === "RESET_TARGET_CHAT") {
        const { target, user } = payload || {};
        setMessages((prev) => {
          let updated;
          if (target === "global") {
            updated = prev.filter((m) => m.recipientTarget && m.recipientTarget !== "global");
          } else if (target && user) {
            const tLow = target.toLowerCase();
            const uLow = user.toLowerCase();
            updated = prev.filter(
              (m) =>
                !(
                  (m.senderName.toLowerCase() === uLow && m.recipientTarget.toLowerCase() === tLow) ||
                  (m.senderName.toLowerCase() === tLow && m.recipientTarget.toLowerCase() === uLow)
                )
            );
          } else {
            updated = prev;
          }
          saveAllMessages(updated);
          return updated;
        });
        showToast("🧹 Chat history cleared for active room");
      } else if (type === "RESET_ALL_CHATS") {
        setMessages([]);
        saveAllMessages([]);
        showToast("🧹 ALL chat history cleared");
      }
    };

    if (name) {
      sendMyPing();
      const currentList = loadRegisteredUsers();
      channel.postMessage({ type: "USERS_UPDATED", payload: currentList });
    }

    const interval = setInterval(() => {
      sendMyPing();
      setOnlinePings((prev) => {
        const now = Date.now();
        const next = new Map();
        prev.forEach((lastSeen, uNameKey) => {
          if (now - lastSeen < 6000) {
            next.set(uNameKey, lastSeen);
          }
        });
        return next;
      });
    }, 1500);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [name]);

  const validName = (v) => Boolean(v && v.trim().length > 0);

  const handleLogin = () => {
    setError("");
    const trimmed = name.trim();
    if (!validName(trimmed)) {
      setError("Please enter your name to continue.");
      return;
    }

    const newUser = {
      name: trimmed,
      registeredAt: Date.now(),
      lastActive: Date.now(),
    };

    registerUserInStore(newUser);
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ name: trimmed }));

    setName(trimmed);
    setMessages(loadAllMessages());
    setScreen("chat");

    channelRef.current?.postMessage({
      type: "PRESENCE_PING",
      payload: { name: trimmed, isInitial: true, timestamp: Date.now() },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setScreen("auth");
    setName("");
    setInput("");
    setSelectedImage(null);
    setError("");
  };

  const send = () => {
    const text = input.trim();
    if (!text && !selectedImage) return;

    const newMsg = {
      id: Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      senderName: name.trim(),
      recipientTarget: activeTarget,
      content: text,
      image: selectedImage,
      timestamp: Date.now(),
    };

    setInput("");
    setSelectedImage(null);

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

  // Reset ONLY Current Active Chat
  const resetActiveChat = () => {
    const myNameKey = name.trim().toLowerCase();
    const targetKey = activeTarget.toLowerCase();

    setMessages((prev) => {
      let updated;
      if (targetKey === "global") {
        updated = prev.filter((m) => m.recipientTarget && m.recipientTarget !== "global");
      } else {
        updated = prev.filter(
          (m) =>
            !(
              (m.senderName.toLowerCase() === myNameKey && m.recipientTarget.toLowerCase() === targetKey) ||
              (m.senderName.toLowerCase() === targetKey && m.recipientTarget.toLowerCase() === myNameKey)
            )
        );
      }
      saveAllMessages(updated);
      return updated;
    });

    channelRef.current?.postMessage({
      type: "RESET_TARGET_CHAT",
      payload: { target: targetKey, user: myNameKey },
    });

    const roomLabel = targetKey === "global" ? "Group Chat" : `Chat with ${activeTargetUserObj?.name || activeTarget}`;
    showToast(`🧹 ${roomLabel} Reset!`);
  };

  // Reset ALL Chats Everywhere
  const resetAllChats = () => {
    setMessages([]);
    saveAllMessages([]);
    channelRef.current?.postMessage({ type: "RESET_ALL_CHATS" });
    showToast("🧹 ALL Chats & DMs Reset!");
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredMessages = messages.filter((m) => {
    if (activeTarget === "global") {
      return !m.recipientTarget || m.recipientTarget === "global";
    } else {
      const myNameKey = name.trim().toLowerCase();
      const targetKey = activeTarget.toLowerCase();
      return (
        (m.senderName.toLowerCase() === myNameKey && m.recipientTarget.toLowerCase() === targetKey) ||
        (m.senderName.toLowerCase() === targetKey && m.recipientTarget.toLowerCase() === myNameKey)
      );
    }
  });

  const getUnreadCount = (targetName) => {
    const myNameKey = name.trim().toLowerCase();
    const targetKey = targetName.toLowerCase();
    return messages.filter(
      (m) =>
        m.senderName.toLowerCase() === targetKey &&
        m.recipientTarget.toLowerCase() === myNameKey &&
        activeTarget.toLowerCase() !== targetKey
    ).length;
  };

  const isUserOnline = (userNameStr) => {
    if (!userNameStr) return false;
    const low = userNameStr.trim().toLowerCase();
    if (low === name.trim().toLowerCase()) return true;
    return onlinePings.has(low);
  };

  const onlineUsersList = registeredUsers.filter((u) => isUserOnline(u.name));
  const offlineUsersList = registeredUsers.filter((u) => !isUserOnline(u.name));

  const otherRegisteredUsers = registeredUsers.filter(
    (u) => u.name.toLowerCase() !== name.trim().toLowerCase()
  );

  const activeTargetUserObj =
    activeTarget === "global"
      ? null
      : registeredUsers.find((u) => u.name.toLowerCase() === activeTarget.toLowerCase());

  const styles = {
    page: {
      minHeight: "100dvh",
      height: "100dvh",
      width: "100vw",
      background: "linear-gradient(180deg, #FFF0F5 0%, #FCE4EC 50%, #FDEDF3 100%)",
      fontFamily: "'Quicksand', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
      WebkitTapHighlightColor: "transparent",
    },
    card: {
      width: "90%",
      maxWidth: 400,
      background: "#FFFFFF",
      borderRadius: 24,
      boxShadow: "0 20px 50px -12px rgba(232,92,138,0.25)",
      padding: "32px 24px",
      boxSizing: "border-box",
      zIndex: 2,
    },
    title: {
      fontFamily: "'Fredoka', sans-serif",
      fontSize: 26,
      color: "#4A3B47",
      textAlign: "center",
      margin: "10px 0 4px",
      fontWeight: 600,
    },
    subtitle: {
      textAlign: "center",
      color: "#B48A9C",
      fontSize: 13.5,
      marginBottom: 18,
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: 16,
      border: "2px solid #F6D9E4",
      fontSize: 16,
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

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap');
        
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        input:focus { border-color: #E85C8A !important; }
        button:active { transform: scale(0.96); }
        
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #F0C4D6; border-radius: 10px; }
        .user-item:hover { background: #FFF0F5 !important; }

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

        .kitty-waving-mascot {
          animation: mascotWave 4s ease-in-out infinite;
        }
        @keyframes mascotWave {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        .waving-hand {
          transform-origin: 25px 85px;
          animation: handWobble 1.2s ease-in-out infinite;
        }
        @keyframes handWobble {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(18deg); }
        }

        .kitty-floating-mascot {
          animation: mascotFloat 4.5s ease-in-out infinite;
        }
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-14px) scale(1.03); }
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

        .online-green-pulse {
          display: inline-block;
          width: 9px;
          height: 9px;
          background-color: #2ECC71;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(46, 204, 113, 0.4);
          animation: greenPulse 1.6s infinite;
        }
        @keyframes greenPulse {
          0% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(46, 204, 113, 0); }
          100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
        }

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

        .msg-bubble-animated {
          animation: msgPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes msgPop {
          0% { opacity: 0; transform: scale(0.92) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .reset-toast-animated {
          animation: toastSlide 0.3s ease-out;
        }
        @keyframes toastSlide {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* Lovely Rotating Quote Transition */
        .lovely-quote-banner {
          animation: quoteFadeIn 0.8s ease-in-out;
        }
        @keyframes quoteFadeIn {
          0% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Hello Kitty Running Back & Forth */
        @keyframes kittyRunLoop {
          0% { left: -60px; transform: scaleX(1); }
          47.5% { left: calc(100vw + 60px); transform: scaleX(1); }
          50% { left: calc(100vw + 60px); transform: scaleX(-1); }
          97.5% { left: -60px; transform: scaleX(-1); }
          100% { left: -60px; transform: scaleX(1); }
        }
        .running-kitty-sprite {
          animation: kittyRunLoop 20s linear infinite;
        }

        /* Kitty Cat Running Back & Forth in Opposite Direction */
        @keyframes catRunLoop {
          0% { left: calc(100vw + 60px); transform: scaleX(-1); }
          47.5% { left: -60px; transform: scaleX(-1); }
          50% { left: -60px; transform: scaleX(1); }
          97.5% { left: calc(100vw + 60px); transform: scaleX(1); }
          100% { left: calc(100vw + 60px); transform: scaleX(-1); }
        }
        .running-cat-sprite {
          animation: catRunLoop 24s linear infinite;
        }

        /* Mobile Responsive Optimizations */
        @media (max-width: 600px) {
          .desktop-side-decoration {
            display: none !important;
          }
          .chat-main-container {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100dvh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .mobile-header-title {
            font-size: 14px !important;
          }
          .mobile-header-subtitle {
            font-size: 11px !important;
          }
          .mobile-btn-compact {
            padding: 6px 8px !important;
            font-size: 11px !important;
          }
          .chat-input-element {
            font-size: 16px !important;
          }
        }
      `}</style>

      {/* Floating background elements */}
      <div className="bg-float-item" style={{ left: "10%", animationDuration: "9s" }}>🎀</div>
      <div className="bg-float-item" style={{ left: "25%", animationDuration: "12s", animationDelay: "2s" }}>✨</div>
      <div className="bg-float-item" style={{ left: "70%", animationDuration: "8s", animationDelay: "1s" }}>💖</div>
      <div className="bg-float-item" style={{ left: "85%", animationDuration: "11s", animationDelay: "3s" }}>🎀</div>
      <div className="bg-float-item" style={{ left: "48%", animationDuration: "10s", animationDelay: "4s" }}>🐾</div>

      {/* BACKGROUND RUNNING ANIMATION */}
      {RUNNING_HELLO_KITTY()}
      {RUNNING_CAT()}

      {/* LAPTOP / DESKTOP LEFT SIDE ANIMATED DECORATION */}
      <div
        className="desktop-side-decoration"
        style={{
          position: "fixed",
          left: "4%",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            padding: "10px 16px",
            borderRadius: 20,
            boxShadow: "0 8px 24px rgba(232,92,138,0.25)",
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 14,
            color: "#4A3B47",
            fontWeight: 600,
            marginBottom: 12,
            border: "2px solid #F6D9E4",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>Pyaru Pyaru Baatee</span> 🎀
        </div>
        {HELLO_KITTY_MASCOT({ wave: true })}
        <div style={{ marginTop: 10, fontSize: 13, color: "#B4577A", fontWeight: 700 }}>
          ✨ Hello Kitty & Friends ✨
        </div>
      </div>

      {/* LAPTOP / DESKTOP RIGHT SIDE ANIMATED DECORATION */}
      <div
        className="desktop-side-decoration"
        style={{
          position: "fixed",
          right: "4%",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            padding: "10px 16px",
            borderRadius: 20,
            boxShadow: "0 8px 24px rgba(232,92,138,0.25)",
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 14,
            color: "#4A3B47",
            fontWeight: 600,
            marginBottom: 12,
            border: "2px solid #F6D9E4",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>Let's Chat!</span> 🐾✨
        </div>
        {HELLO_KITTY_MASCOT({ wave: false })}
        <div style={{ marginTop: 10, fontSize: 13, color: "#B4577A", fontWeight: 700 }}>
          💖 Sweet & Bubbly 💖
        </div>
      </div>

      {/* FULL-SIZE IMAGE PREVIEW MODAL */}
      {previewImageModal && (
        <div
          onClick={() => setPreviewImageModal(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            cursor: "zoom-out",
          }}
        >
          <div style={{ position: "relative", maxWidth: "94%", maxHeight: "90%" }}>
            <img
              src={previewImageModal}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                borderRadius: 18,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            />
            <button
              onClick={() => setPreviewImageModal(null)}
              style={{
                position: "absolute",
                top: -14,
                right: -14,
                background: "#E85C8A",
                color: "#fff",
                border: "2px solid #fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* AUTH SCREEN */}
      {screen !== "chat" ? (
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "center" }}>{HELLO_KITTY_AVATAR(68)}</div>
          <div style={styles.title}>Pyaru Pyaru Baatee 🎀</div>
          <div style={styles.subtitle}>Enter your name to enter the chat room</div>

          <input
            className="chat-input-element"
            style={styles.input}
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoFocus
          />
          {error && <div style={styles.error}>{error}</div>}
          <button style={styles.button} onClick={handleLogin}>
            Enter Chat 🎀
          </button>
          <PawDivider />
        </div>
      ) : (
        /* MAIN CHAT CONTAINER */
        <div
          className="chat-main-container"
          style={{
            maxWidth: 520,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            height: "100dvh",
            background: "#FFFFFF",
            boxShadow: "0 0 40px rgba(232, 92, 138, 0.15)",
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* Reset Confirmation Toast Banner */}
          {toastMessage && (
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
                fontSize: 12.5,
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                boxShadow: "0 6px 18px rgba(232,92,138,0.4)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              {toastMessage}
            </div>
          )}

          {/* Main Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              background: "#FFFFFF",
              borderBottom: "2px solid #FBEBF1",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              {HELLO_KITTY_AVATAR(32)}
              <div style={{ minWidth: 0 }}>
                <div
                  className="mobile-header-title"
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: 15,
                    color: "#4A3B47",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {activeTarget === "global"
                    ? "Pyaru Pyaru Baatee 🎀"
                    : `💬 ${activeTargetUserObj?.name || activeTarget}`}
                </div>
                <div
                  className="mobile-header-subtitle"
                  style={{ fontSize: 11.5, color: "#C79AB0", display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span>hi, <strong>{name}</strong> ✨</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
              {/* TARGETED RESET CHAT BUTTON */}
              <button
                onClick={resetActiveChat}
                className="mobile-btn-compact"
                title={activeTarget === "global" ? "Reset Group Chat" : `Reset Personal Chat with ${activeTargetUserObj?.name || activeTarget}`}
                style={{
                  border: "none",
                  background: "#FFE6EE",
                  color: "#D9436A",
                  borderRadius: 12,
                  padding: "7px 10px",
                  fontSize: 11.5,
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  boxShadow: "0 2px 6px rgba(217,67,106,0.12)",
                }}
              >
                <span>🔄 Clear</span>
              </button>
              {/* ACTIVE ONLINE USERS BUTTON */}
              <button
                onClick={() => setShowUsersPanel(!showUsersPanel)}
                className="mobile-btn-compact"
                style={{
                  border: "none",
                  background: showUsersPanel ? "#E85C8A" : "#E8F8F0",
                  color: showUsersPanel ? "#FFFFFF" : "#1E8449",
                  borderRadius: 12,
                  padding: "7px 10px",
                  fontSize: 11.5,
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: "0 2px 6px rgba(46,204,113,0.15)",
                }}
              >
                <span className="online-green-pulse" />
                <span>{onlineUsersList.length} Online</span>
              </button>
              <button
                onClick={handleLogout}
                className="mobile-btn-compact"
                style={{
                  border: "none",
                  background: "#FFF0F4",
                  color: "#B4577A",
                  borderRadius: 12,
                  padding: "7px 9px",
                  fontSize: 11.5,
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Registered Users Navigation Bar */}
          <div
            style={{
              background: "#FFF8FA",
              borderBottom: "2px solid #FBEBF1",
              padding: "8px 12px",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "#B4577A", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {BOW(14)} TALK TO FRIENDS:
              </div>
              <div style={{ fontSize: 10.5, color: "#27AE60", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                <span className="online-green-pulse" style={{ width: 7, height: 7 }} />
                <span>{onlineUsersList.length} Active Now</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                overflowX: "auto",
                paddingBottom: 2,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Global Room Button */}
              <button
                onClick={() => setActiveTarget("global")}
                style={{
                  border: activeTarget === "global" ? "2px solid #E85C8A" : "1.5px solid #F6D9E4",
                  background: activeTarget === "global" ? "#FFE6EE" : "#FFFFFF",
                  color: "#4A3B47",
                  borderRadius: 14,
                  padding: "5px 10px",
                  fontSize: 12,
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: activeTarget === "global" ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: activeTarget === "global" ? "0 3px 10px rgba(232,92,138,0.2)" : "none",
                }}
              >
                <span>🎀 Everyone</span>
                <span style={{ fontSize: 9.5, background: "#E85C8A", color: "#fff", padding: "1px 5px", borderRadius: 8 }}>
                  Group
                </span>
              </button>

              {/* List of Registered Users */}
              {otherRegisteredUsers.map((u) => {
                const online = isUserOnline(u.name);
                const unread = getUnreadCount(u.name);
                const isSelected = activeTarget.toLowerCase() === u.name.toLowerCase();
                return (
                  <button
                    key={u.name}
                    onClick={() => setActiveTarget(u.name)}
                    style={{
                      border: isSelected
                        ? "2px solid #E85C8A"
                        : online
                        ? "1.5px solid #A3E4D7"
                        : "1.5px solid #F6D9E4",
                      background: isSelected
                        ? "#FFE6EE"
                        : online
                        ? "#E8F8F5"
                        : "#FFFFFF",
                      color: "#4A3B47",
                      borderRadius: 14,
                      padding: "5px 10px",
                      fontSize: 12,
                      fontFamily: "'Quicksand', sans-serif",
                      fontWeight: isSelected || online ? 700 : 500,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      boxShadow: isSelected ? "0 3px 10px rgba(232,92,138,0.2)" : "none",
                    }}
                  >
                    {online ? (
                      <span className="online-green-pulse" style={{ width: 7, height: 7 }} />
                    ) : (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#BDC3C7" }} />
                    )}
                    <span>{u.name}</span>
                    {online && (
                      <span style={{ fontSize: 9.5, color: "#117A65", fontWeight: 700 }}>
                        (Online)
                      </span>
                    )}
                    {unread > 0 && (
                      <span
                        style={{
                          background: "#D9436A",
                          color: "#fff",
                          fontSize: 9.5,
                          fontWeight: 700,
                          borderRadius: "50%",
                          width: 15,
                          height: 15,
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

          {/* Collapsible Full Active Users Directory Panel */}
          {showUsersPanel && (
            <div
              style={{
                background: "#FFFBFD",
                borderBottom: "2px solid #FBEBF1",
                padding: 12,
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#4A3B47" }}>
                  🟢 ACTIVE FRIENDS ONLINE ({onlineUsersList.length})
                </span>
                <div style={{ display: "flex", gap: 5 }}>
                  <button
                    onClick={resetActiveChat}
                    style={{
                      border: "none",
                      background: "#FFE6EE",
                      color: "#D9436A",
                      fontSize: 10.5,
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    🔄 Clear Chat
                  </button>
                  <button
                    onClick={resetAllChats}
                    style={{
                      border: "none",
                      background: "#FFF0F4",
                      color: "#B4577A",
                      fontSize: 10.5,
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    🧹 Clear ALL
                  </button>
                </div>
              </div>

              {/* Online Friends List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {onlineUsersList.map((u) => {
                  const isMe = u.name.toLowerCase() === name.trim().toLowerCase();
                  const avatarBg = getAvatarColor(u.name);
                  const isSelected = activeTarget.toLowerCase() === u.name.toLowerCase();
                  return (
                    <div
                      key={u.name}
                      onClick={() => {
                        if (!isMe) {
                          setActiveTarget(u.name);
                          setShowUsersPanel(false);
                        }
                      }}
                      className="user-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: 12,
                        background: isSelected ? "#FFE6EE" : "#E8F8F5",
                        border: "1px solid #A3E4D7",
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
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#117A65" }}>
                            {u.name} {isMe && "(You)"}
                          </div>
                        </div>
                      </div>
                      {!isMe && (
                        <button
                          style={{
                            border: "none",
                            background: "linear-gradient(135deg, #FF8FAB, #E85C8A)",
                            color: "#fff",
                            fontSize: 10.5,
                            fontWeight: 700,
                            borderRadius: 10,
                            padding: "4px 10px",
                            cursor: "pointer",
                          }}
                        >
                          💬 Talk Now
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Offline Friends List */}
              {offlineUsersList.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#95A5A6", marginBottom: 6 }}>
                    ⚪ OFFLINE FRIENDS ({offlineUsersList.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {offlineUsersList.map((u) => {
                      const avatarBg = getAvatarColor(u.name);
                      return (
                        <div
                          key={u.name}
                          onClick={() => {
                            setActiveTarget(u.name);
                            setShowUsersPanel(false);
                          }}
                          className="user-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 10px",
                            borderRadius: 12,
                            background: "#FFFFFF",
                            border: "1px solid #F6D9E4",
                            cursor: "pointer",
                            opacity: 0.8,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background: "#BDC3C7",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 11,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: "#7F8C8D" }}>
                              {u.name}
                            </div>
                          </div>
                          <span style={{ fontSize: 10, color: "#95A5A6" }}>Offline</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lovely Rotating Quote Banner (Changes every 30 seconds) */}
          <div
            className="lovely-quote-banner"
            key={lovelyQuoteIndex}
            style={{
              background: "#FFF5F8",
              borderBottom: "1px dashed #F6CEFC",
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 600,
              color: "#B4577A",
              textAlign: "center",
              letterSpacing: "0.1px",
            }}
          >
            {LOVELY_MESSAGES[lovelyQuoteIndex]}
          </div>

          {/* Chat Messages Feed */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "#FAF4F7",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {filteredMessages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#C79AB0",
                  marginTop: 36,
                  fontSize: 13.5,
                }}
              >
                {HELLO_KITTY_AVATAR(46)}
                <div style={{ marginTop: 10, fontFamily: "'Fredoka', sans-serif", fontSize: 15 }}>
                  {activeTarget === "global"
                    ? "Welcome to Pyaru Pyaru Baatee! 🎀"
                    : `No messages with ${activeTargetUserObj?.name || activeTarget} yet!`}
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Type a message or send an image below! 📷✨🐾
                </div>
              </div>
            ) : (
              filteredMessages.map((m) => {
                const isMe = m.senderName.toLowerCase() === name.trim().toLowerCase();
                return (
                  <div
                    key={m.id}
                    className="msg-bubble-animated"
                    style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    {!isMe && (
                      <div
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: "#B4577A",
                          marginBottom: 2,
                          paddingLeft: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {BOW(13)} {m.senderName}
                      </div>
                    )}
                    <div
                      style={{
                        background: isMe
                          ? "linear-gradient(135deg, #FF8FAB, #E85C8A)"
                          : "#FFFFFF",
                        color: isMe ? "#FFFFFF" : "#4A3B47",
                        padding: "10px 14px",
                        borderRadius: isMe
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                        fontSize: 14,
                        lineHeight: 1.45,
                        boxShadow: "0 3px 12px -5px rgba(232,92,138,0.2)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {/* Image Attachment Rendering */}
                      {m.image && (
                        <div style={{ marginBottom: m.content ? 6 : 0 }}>
                          <img
                            src={m.image}
                            alt="Attachment"
                            onClick={() => setPreviewImageModal(m.image)}
                            style={{
                              maxWidth: "100%",
                              maxHeight: 220,
                              borderRadius: 12,
                              display: "block",
                              cursor: "zoom-in",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                            }}
                          />
                        </div>
                      )}
                      {m.content}
                    </div>
                    <div
                      style={{
                        fontSize: 9.5,
                        color: "#C79AB0",
                        marginTop: 2,
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

          {/* Image Selection Preview Banner above Input Bar */}
          {selectedImage && (
            <div
              style={{
                padding: "8px 12px",
                background: "#FFE6EE",
                borderTop: "2px solid #FBEBF1",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: "2px solid #E85C8A" }}
                />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#4A3B47" }}>
                  📷 Image ready to send
                </span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  border: "none",
                  background: "#D9436A",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div
            style={{
              padding: "10px 12px calc(10px + env(safe-area-inset-bottom, 4px)) 12px",
              background: "#FFFFFF",
              borderTop: "2px solid #FBEBF1",
            }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {/* Hidden File Input for Image Upload */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageFileSelect}
                style={{ display: "none" }}
              />

              {/* Image Picker Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Send an Image"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "2px solid #F6D9E4",
                  background: "#FFF0F5",
                  fontSize: 17,
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                📷
              </button>

              <input
                className="chat-input-element"
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  borderRadius: 20,
                  border: "2px solid #F6D9E4",
                  outline: "none",
                  fontSize: 16,
                  fontFamily: "'Quicksand', sans-serif",
                  color: "#4A3B47",
                  background: "#FFFBFD",
                }}
                placeholder={
                  activeTarget === "global"
                    ? "Message Everyone... 🎀"
                    : `Message ${activeTargetUserObj?.name || activeTarget}... ✨`
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />

              <button
                onClick={send}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "none",
                  background: "linear-gradient(135deg, #FF8FAB, #E85C8A)",
                  color: "#fff",
                  fontSize: 17,
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(232, 92, 138, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
