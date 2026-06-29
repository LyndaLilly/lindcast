import React, { useEffect, useState } from "react";
import ApiUrl from "../../constants/ApiUrl";

function ChatAdmin() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // load all chats
  const loadConversations = async () => {
    try {
      const res = await fetch(ApiUrl.ADMIN_CHAT_CONVERSATIONS, {
        method: "POST",
      });

      const data = await res.json();

      console.log("CONVERSATIONS:", data); // 👈 PUT IT HERE

      if (data.status) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // load messages
  const loadMessages = async (id) => {
    setActiveId(id);

    try {
      const res = await fetch(ApiUrl.ADMIN_CHAT_MESSAGES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ conversation_id: id }),
      });

      const text = await res.text(); // 👈 IMPORTANT (not json)

      console.log("RAW RESPONSE:", text); // 👈 THIS SHOWS REAL ERROR

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("NOT JSON RESPONSE (Laravel error above)");
        return;
      }

      if (data.status) {
        setMessages(data.messages);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  last_message:
                    data.messages[data.messages.length - 1]?.message,
                }
              : c,
          ),
        );
      }
    } catch (err) {
      console.log("REQUEST FAILED:", err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversations.length > 0 && !activeId) {
      loadMessages(conversations[0].id);
    }
  }, [conversations]);
  // send reply
  const sendReply = async () => {
    if (!input.trim()) return;

    await fetch(ApiUrl.ADMIN_CHAT_SEND, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: activeId,
        message: input,
      }),
    });

    setInput("");
    loadMessages(activeId);
  };

  useEffect(() => {
    loadConversations();

    const timer = setInterval(loadConversations, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT: conversations */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <h3>Chats</h3>

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => loadMessages(c.id)}
            style={{
              padding: 10,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              background: activeId === c.id ? "var(--primary)" : "transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>Chat #{c.id}</strong>
              <small style={{ fontSize: 10, opacity: 0.7 }}>
                {new Date(c.last_message_at).toLocaleTimeString()}
              </small>
            </div>

            <small style={{ opacity: 0.8 }}>
              {c.last_message || "No messages yet"}
            </small>
          </div>
        ))}
      </div>

      {/* RIGHT: messages */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: 20,
        }}
      >
        <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                textAlign: m.sender_type === "admin" ? "right" : "left",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: 8,
                  borderRadius: 8,
                  background:
                    m.sender_type === "admin"
                      ? "var(--primary)"
                      : "var(--card)",
                  color: m.sender_type === "admin" ? "#fff" : "var(--text)",
                }}
              >
                {m.message}
              </div>
            </div>
          ))}
        </div>

        {/* input */}
        {/* Reply Bar */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            background: "#fff",
            padding: "15px 20px",
            borderTop: "1px solid #e5e7eb",
            boxShadow: "0 -3px 12px rgba(0,0,0,.05)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 100,
            width: "calc(100% - 30%)", 
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendReply();
              }
            }}
            placeholder="Type your reply..."
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRadius: 30,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: 15,
              background: "#f8f9fb",
              transition: ".2s",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid var(--primary)";
              e.target.style.background = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid #ddd";
              e.target.style.background = "#f8f9fb";
            }}
          />

          <button
            onClick={sendReply}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: ".2s",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatAdmin;
