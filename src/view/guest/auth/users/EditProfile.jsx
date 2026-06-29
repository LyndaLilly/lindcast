import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiUrl from "../../../../constants/ApiUrl";
import { useAuth } from "../../../../contexts/AuthContext";
import "../../../../assets/css/editprofile.css";

function EditProfile() {
  const { user, token, fetchMe } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate inputs when user loads
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const saveProfile = async () => {
    if (!username || !email || !phone) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(ApiUrl.UPDATE_PROFILE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Unable to update profile.");
        return;
      }

      // Fetch latest user information
      const me = await fetch(ApiUrl.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const meData = await me.json();

      if (me.ok) {
        // Update AuthContext immediately
        fetchMe();

        // Optional: update localStorage if you store user there
        localStorage.setItem("user", JSON.stringify(meData.user));
      }

      alert("Profile updated successfully.");

      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>
        <p>Update your account information below.</p>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="button-row">
          <button
            className="cancel-btn"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            disabled={loading}
            onClick={saveProfile}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;