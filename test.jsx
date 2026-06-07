import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiUrl from "../constants/ApiUrl";
import "../assets/css/home.css";

const getUserImage = (user) => {
  if (!user?.image && !user?.profile_image) {
    return "https://cdn.vectorstock.com/i/500p/48/31/emo-teen-avatar-vector-4304831.jpg";
  }

  const imagePath = user?.image || user?.profile_image;

  if (imagePath.startsWith("http")) return imagePath;

  return `${ApiUrl.IMAGE_BASE_URL}/${imagePath}`;
};

function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return;

      try {
        const res = await fetch(ApiUrl.ME, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setUser(data.user || data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchMe();
  }, []);

  const profileImage = getUserImage(user);

  return (
    <header className={`main-header ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="header-content">

          {/* LOGO */}
          <div className="logo-area">
            <div className="logo-box">₿</div>
            <div>
              <h3 className="logo-text">Crypto Predict</h3>
              <small className="logo-sub">Live Prediction Market</small>
            </div>
          </div>

          {/* MENU ICON */}
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          {/* NAV */}
          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          </nav>

          {/* RIGHT SIDE */}
         <div className="header-actions">

  {!token ? (
    <>
      <Link to="/login" className="btn-login">Login</Link>
      <Link to="/register" className="btn-register">Register</Link>
    </>
  ) : (
    <div className="user-wrapper">

      {/* DESKTOP USER INFO */}
      <div className="user-desktop">
        <div className="logged-user">
          <img src={profileImage} alt="profile" />
          <div>
            <small>Welcome back</small>
            <span>@{user?.username}</span>
          </div>
        </div>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* MOBILE USER ICON */}
      <button
        className="user-toggle"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        <img src={profileImage} alt="user" />
      </button>

      {/* MOBILE DROPDOWN */}
      <div className={`user-dropdown ${userMenuOpen ? "active" : ""}`}>
        <div className="user-info">
          <img src={profileImage} alt="profile" />
          <div>
            <small>Welcome back</small>
            <h5>@{user?.username}</h5>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

    </div>
  )}

</div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;