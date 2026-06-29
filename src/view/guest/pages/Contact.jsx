import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiUrl from "../../../constants/ApiUrl";

function Contact() {
  // ================= CHAT STATE =================
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const guestId = (() => {
    let id = localStorage.getItem("stakeova_guest_id");

    if (!id) {
      id =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

      localStorage.setItem("stakeova_guest_id", id);
    }

    return id;
  })();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    try {
      const res = await fetch(ApiUrl.CHAT_SEND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          guest_id: guestId,
          message: input,
        }),
      });

      const data = await res.json();

      if (data.status) {
        setInput("");
        loadMessages(conversationId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const startConversation = async () => {
    try {
      const res = await fetch(ApiUrl.CHAT_START, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          guest_id: guestId,
        }),
      });

      const data = await res.json();

      if (data.status) {
        setConversationId(data.conversation.id);
        loadMessages(data.conversation.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadMessages = async (id = conversationId) => {
    if (!id) return;

    try {
      const res = await fetch(ApiUrl.CHAT_MESSAGES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          conversation_id: id,
          guest_id: guestId,
        }),
      });

      const data = await res.json();

      if (data.status) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!chatOpen || !conversationId) return;

    const timer = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(timer);
  }, [chatOpen, conversationId]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
    startedAt: Date.now(),
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitContact = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch(ApiUrl.CONTACT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setSuccess(data?.message || "Something went wrong ❌");
        return;
      }

      if (data?.status) {
        setSuccess("Message sent successfully 🚀");

        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
          website: "",
          startedAt: Date.now(),
        });
      } else {
        setSuccess(data?.message || "Failed to send message ❌");
      }
    } catch (err) {
      console.log(err);
      setSuccess("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-badge">📞 Contact Stakeova</div>

          <h1 className="contact-title">
            We'd Love To <span>Hear From You</span>
          </h1>

          <p className="contact-text">
            Need help with predictions, deposits, withdrawals, challenges, or
            your account? Our support team is ready to assist.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* EMAIL */}
            <div className="col-md-4">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h4>Email Support</h4>
                <p>Reach our support team anytime.</p>
                <a href="mailto:support@cryptopredict.com">
                  support@cryptopredict.com
                </a>
              </div>
            </div>

            {/* CHAT */}
            <div className="col-md-4">
              <div className="contact-card">
                <div className="contact-icon">💬</div>
                <h4>Live Chat</h4>
                <p>Get instant help from our team.</p>

                <button
                  className="btn btn-success mt-2"
                  onClick={() => {
                    setChatOpen(true);
                    startConversation();
                  }}
                >
                  Start Chat
                </button>
              </div>
            </div>

            {/* COMMUNITY */}
            <div className="col-md-4">
              <div className="contact-card">
                <div className="contact-icon">🌍</div>
                <h4>Community</h4>
                <p>Join traders worldwide.</p>

                <div className="d-flex gap-3 mt-2">
                  <a href="#">Telegram</a>
                  <a href="#">Discord</a>
                  <a href="#">𝕏</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="pb-5">
        <div className="container">
          <div className="contact-form-card">
            <h2 className="mb-4">Send Us A Message</h2>

            <form onSubmit={submitContact}>
              <div className="row g-3">
                <input
                  type="text"
                  name="website"
                  value={form.website || ""}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="col-md-6">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control contact-input"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control contact-input"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="col-12">
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="form-control contact-input"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="col-12">
                  <textarea
                    rows="6"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="form-control contact-input"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* STATUS MESSAGE */}
                {success && (
                  <div className="col-12">
                    <p style={{ color: "#22c55e" }}>{success}</p>
                  </div>
                )}

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= CHAT MODAL ================= */}
      {chatOpen && (
        <div className="chat-overlay">
          <div className="chat-box">
            {/* HEADER */}
            <div className="chat-header">
              <h5>Stakeova Support</h5>
              <button onClick={() => setChatOpen(false)}>✖</button>
            </div>

            {/* MESSAGES */}
            <div className="chat-body" ref={chatRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-msg ${
                    msg.sender_type === "user" ? "user" : "support"
                  }`}
                >
                  <p>{msg.message}</p>
                  <small>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="chat-footer">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
