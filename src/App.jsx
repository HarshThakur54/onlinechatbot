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

export default function KittyChat() {
  const [screen, setScreen] = useState("auth"); // auth | onboard | chat
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleContinue = async () => {
    setError("");
    if (!validEmail(email)) {
      setError("That doesn't look like a real email.");
      return;
    }
    setChecking(true);
    try {
      const raw = localStorage.getItem(`user:${email.toLowerCase()}`);
      if (raw) {
        const data = JSON.parse(raw);
        setUsername(data.username);
        const hist = safeGet(`messages:${email.toLowerCase()}`);
        setMessages(hist || []);
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

  const safeGet = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const handleCreateAccount = async () => {
    setError("");
    if (!username.trim()) {
      setError("Pick a username, cutie.");
      return;
    }
    setChecking(true);
    try {
      localStorage.setItem(
        `user:${email.toLowerCase()}`,
        JSON.stringify({ username: username.trim(), createdAt: Date.now() })
      );
      const welcome = [
        {
          role: "assistant",
          content: `Hii ${username.trim()}! 🎀 I'm your Bow Bot — ask me anything!`,
        },
      ];
      setMessages(welcome);
      localStorage.setItem(`messages:${email.toLowerCase()}`, JSON.stringify(welcome));
      setScreen("chat");
    } catch {
      setError("Couldn't save your account, try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = () => {
    setScreen("auth");
    setEmail("");
    setUsername("");
    setMessages([]);
    setInput("");
    setError("");
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setSending(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          system:
            "You are Bow Bot, a cheerful, sweet, slightly bubbly chat assistant with a pastel-pink kitty-bow theme. Keep replies warm, concise, and sprinkle in the occasional 🎀 or ✨ emoji, but stay genuinely helpful and clear — don't let the cuteness get in the way of a good answer.",
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const textBlock = data.content?.find((c) => c.type === "text");
      const reply = textBlock?.text || "Sorry, I got a little tangled in my bow — try again?";
      const updated = [...next, { role: "assistant", content: reply }];
      setMessages(updated);
      localStorage.setItem(`messages:${email.toLowerCase()}`, JSON.stringify(updated));
    } catch {
      setMessages([...next, { role: "assistant", content: "Oops, my whiskers crossed a wire. Try again?" }]);
    } finally {
      setSending(false);
    }
  };

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
          <div style={styles.title}>{screen === "auth" ? "Welcome back" : "Almost there!"}</div>
          <div style={styles.subtitle}>
            {screen === "auth" ? "Just your email — no password needed" : "Pick a username to finish up"}
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
                {checking ? "One sec..." : "Continue"}
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
                {checking ? "Creating..." : "Create account"}
              </button>
            </>
          )}
          <PawDivider />
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.page, alignItems: "stretch", padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap');
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #F0C4D6; border-radius: 10px; }
      `}</style>
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            background: "#FFFFFF",
            borderBottom: "2px solid #FBEBF1",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {BOW(26)}
            <div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "#4A3B47", fontWeight: 600 }}>
                Bow Bot
              </div>
              <div style={{ fontSize: 12, color: "#C79AB0" }}>hi, {username}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "#FBEEF3",
              color: "#B4577A",
              borderRadius: 12,
              padding: "8px 14px",
              fontSize: 13,
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        </div>

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "78%",
                background: m.role === "user" ? "linear-gradient(135deg,#FF8FAB,#E85C8A)" : "#FFFFFF",
                color: m.role === "user" ? "#fff" : "#4A3B47",
                padding: "12px 16px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                fontSize: 14.5,
                lineHeight: 1.5,
                boxShadow: "0 4px 14px -6px rgba(232,92,138,0.2)",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          ))}
          {sending && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "#FFFFFF",
                padding: "12px 16px",
                borderRadius: "18px 18px 18px 4px",
                display: "flex",
                gap: 5,
                boxShadow: "0 4px 14px -6px rgba(232,92,138,0.2)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#E8A9C4",
                    animation: `bounce 1s ${i * 0.15}s infinite`,
                  }}
                />
              ))}
              <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
            </div>
          )}
        </div>

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
              }}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={sending}
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(135deg,#FF8FAB,#E85C8A)",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
                flexShrink: 0,
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
