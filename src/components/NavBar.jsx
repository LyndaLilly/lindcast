import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiUrl from "../constants/ApiUrl";
import "../assets/css/home.css";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/img/icon3.png";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const getUserImage = (user) => {
  if (!user?.image && !user?.profile_image) {
    return "https://cdn.vectorstock.com/i/500p/48/31/emo-teen-avatar-vector-4304831.jpg";
  }

  const imagePath = user?.image || user?.profile_image;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${ApiUrl.IMAGE_BASE_URL}/${imagePath}`;
};

function Navbar() {
  const { user, token, logout } = useAuth();
  const profileImage = getUserImage(user);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileOpen(false);
    };

    if (profileOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <header className={`main-header ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="header-content">
          {/* LOGO */}
          <div className="logo-area">
            <img src={logo} alt="Crypto Predict Logo" className="logo-image" />

            <div className="logo-text-area">
              <h3 className="logo-text">Stakeova</h3>
              <small className="logo-sub">Live Prediction Market</small>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/leaderboard" onClick={() => setMenuOpen(false)}>
              Leaderboard
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact Us
            </Link>

            <Link to="/reward" onClick={() => setMenuOpen(false)}>
              Reward
            </Link>

            {!token && (
              <>
                <Link
                  to="/login"
                  className="mobile-auth-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="mobile-auth-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* RIGHT */}
          <div className="header-actions">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="btn-login"
                  style={{ textDecoration: "none" }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn-register"
                  style={{ textDecoration: "none" }}
                >
                  Register
                </Link>
              </>
            ) : (
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  className="logged-user"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen(!profileOpen);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={profileImage}
                    alt="profile"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #22c55e",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className="username"
                      style={{
                        fontWeight: "700",
                        fontSize: "15px",
                      }}
                    >
                      @{user?.username}
                    </span>
                  </div>
                </div>

                {profileOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "60px",
                      width: "220px",
                      background: "#161b22",
                      border: "1px solid rgba(255,255,255,.08)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 15px 40px rgba(0,0,0,.35)",
                      zIndex: 1000,
                    }}
                  >
                    {/* User Info */}
                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        borderBottom: "1px solid rgba(255,255,255,.08)",
                      }}
                    >
                      <img
                        src={profileImage}
                        alt="Profile"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #22c55e",
                        }}
                      />

                      <div>
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: "15px",
                          }}
                        >
                          @{user?.username}
                        </div>
                      </div>
                    </div>

                    {/* Profile Button */}
                    <Link
                      to="/deleteaccount"
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "14px 16px",
                        color: "#fff",
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(255,255,255,.08)",
                        fontWeight: "600",
                      }}
                    >
                      <FaUserCircle
                        style={{
                          color: "#3b82f6", // Bright blue
                          fontSize: "18px",
                        }}
                      />
                      Profile
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        logout();
                        localStorage.removeItem("token");
                        window.location.href = "/";
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "14px 16px",
                        border: "none",
                        background: "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        fontWeight: "600",
                      }}
                    >
                      <FaSignOutAlt
                        style={{
                          color: "#ef4444", // Bright red
                          fontSize: "18px",
                        }}
                      />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
