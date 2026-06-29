import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaTrashAlt,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaShieldAlt,
} from "react-icons/fa";

import ApiUrl from "../../../../constants/ApiUrl";
import { useAuth } from "../../../../contexts/AuthContext";
import "../../../../assets/css/profile.css";

function Profile() {
  const { user, token, logout } = useAuth();

  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const profileImage =
    user?.image || user?.profile_image
      ? `${ApiUrl.IMAGE_BASE_URL}/${user.image || user.profile_image}`
      : "https://cdn.vectorstock.com/i/500p/48/31/emo-teen-avatar-vector-4304831.jpg";

  const deleteAccount = async () => {
    if (!pin) {
      alert("Please enter your account PIN.");
      return;
    }

    const confirmed = window.confirm(
      "⚠️ WARNING\n\nDeleting your account is PERMANENT.\n\n" +
        "You will permanently lose:\n\n" +
        "• Wallet Balance\n" +
        "• Prediction History\n" +
        "• Rewards\n" +
        "• Statistics\n" +
        "• Your Account\n\n" +
        "THIS ACTION CANNOT BE UNDONE."
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(ApiUrl.DELETE_ACCOUNT, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pin,
        }),
      });

      const data = await res.json();

      alert(data.message);

      if (res.ok) {
        logout();
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* HEADER */}

        <div className="profile-header">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-avatar"
          />

          <h2>@{user?.username}</h2>

          <span className="member-badge">
            <FaShieldAlt />
            Verified Member
          </span>

          <button
            className="edit-profile-btn"
            onClick={() => navigate("/editprofile")}
          >
            <FaUserEdit />
            Edit Profile
          </button>
        </div>

        {/* ACCOUNT INFO */}

        <div className="section-card">
          <h3>Account Information</h3>

          <div className="info-row">
            <div className="info-label">
              <FaUser />
              Username
            </div>

            <div className="info-value">@{user?.username}</div>
          </div>

          <div className="info-row">
            <div className="info-label">
              <FaEnvelope />
              Email
            </div>

            <div className="info-value">
              {user?.email || "Not Available"}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">
              <FaPhone />
              Phone
            </div>

            <div className="info-value">
              {user?.phone || "Not Available"}
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}

        <div className="danger-card">
          <h3>
            <FaTrashAlt />
            Danger Zone
          </h3>

          <p className="danger-text">
            Deleting your account is <strong>PERMANENT</strong>. This action
            cannot be reversed.
          </p>

          <div className="danger-list">
            <div>💰 Wallet balance will be permanently lost.</div>

            <div>📈 Prediction history will be deleted.</div>

            <div>🎁 Rewards and bonuses will be removed.</div>

            <div>📊 Statistics will be erased.</div>

            <div>❌ Your account cannot be recovered.</div>
          </div>

          <input
            type="password"
            className="pin-input"
            placeholder="Enter your PIN to continue"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <button
            className="delete-btn"
            disabled={loading}
            onClick={deleteAccount}
          >
            <FaTrashAlt />

            {loading ? "Deleting Account..." : "Delete My Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;