import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiUrl from "../../../constants/ApiUrl";

function Contact() {
  // ================= CHAT STATE =================
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "support",
      text: "Hi 👋 How can we help you today?",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      from: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // fake support reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "support",
          text: "Thanks for reaching out 🚀 We’ll respond shortly.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }, 1200);
  };

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
          <div className="contact-badge">📞 Contact Crypto Predict</div>

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
                  onClick={() => setChatOpen(true)}
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
              <h5>Crypto Predict Support</h5>
              <button onClick={() => setChatOpen(false)}>✖</button>
            </div>

            {/* MESSAGES */}
            <div className="chat-body" ref={chatRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-msg ${msg.from === "user" ? "user" : "support"}`}
                >
                  <p>{msg.text}</p>
                  <small>{msg.time}</small>
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
