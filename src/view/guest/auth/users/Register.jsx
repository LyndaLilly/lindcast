import { useState } from "react";
import "../../../../assets/css/register.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import ApiUrl from "../../../../constants/ApiUrl";
import { CountryCodes } from "../../../../constants/CountryCodes";

export default function Register() {
  const navigate = useNavigate();

  const [showPin, setShowPin] = useState(false);

  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [country, setCountry] = useState(CountryCodes[0]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    pin: "",
    confirmPin: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // FORMAT PHONE
  const formatPhone = () => {
    let cleaned = form.phone.trim().replace(/\s+/g, "");

    if (cleaned.startsWith(country.code)) {
      cleaned = cleaned.replace(country.code, "");
    }

    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    return country.code + cleaned;
  };

  // VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.username) {
      newErrors.username = "Username is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    }

    if (!form.pin) {
      newErrors.pin = "PIN is required";
    }

    if (form.pin.length < 4) {
      newErrors.pin = "PIN must be at least 4 digits";
    }

    if (form.pin !== form.confirmPin) {
      newErrors.confirmPin = "PINs do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 15000);

      const response = await fetch(ApiUrl.REGISTER_USER, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        signal: controller.signal,

        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: formatPhone(),
          pin: form.pin,
          pin_confirmation: form.confirmPin,
        }),
      });

      clearTimeout(timeout);

      const data = await response.json();

      // BACKEND VALIDATION
      if (response.status === 422) {
        const backendErrors = {};

        if (data.errors?.email) {
          backendErrors.email = data.errors.email[0];
        }

        if (data.errors?.phone) {
          backendErrors.phone = data.errors.phone[0];
        }

        if (data.errors?.username) {
          backendErrors.username = data.errors.username[0];
        }

        if (data.errors?.pin) {
          backendErrors.pin = data.errors.pin[0];
        }

        setErrors(backendErrors);

        return;
      }

      // OTHER ERRORS
      if (!response.ok) {
        setErrors({
          general: data.message || "Registration failed",
        });

        return;
      }

      // SUCCESS
      alert("Registration Successful");

      console.log(data);

      navigate("/verify-email", {
        state: {
          email: form.email,
        },
      });
    } catch (error) {
      setErrors({
        general:
          error?.name === "AbortError"
            ? "Request timeout. Try again."
            : "Network error. Check internet.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* GLOWS */}
      <div className="glow glow-1"></div>

      <div className="glow glow-2"></div>

      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-lg-5 col-md-7 col-sm-11">
            <div className="register-card">
              <div className="register-badge">CREATE ACCOUNT</div>

              <h1 className="register-title">Join The Platform</h1>

              <p className="register-subtitle">
                Create your account and start instantly.
              </p>

              <form onSubmit={handleRegister}>
                {/* GENERAL ERROR */}
                {errors.general && (
                  <div className="alert alert-danger">{errors.general}</div>
                )}

                {/* USERNAME */}
                <div className="mb-3">
                  <div className="custom-input">
                    <FaUser />

                    <input
                      type="text"
                      placeholder="Username"
                      value={form.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                    />
                  </div>

                  {errors.username && (
                    <small className="error-text">{errors.username}</small>
                  )}
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                  <div className="custom-input">
                    <FaEnvelope />

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  {errors.email && (
                    <small className="error-text">{errors.email}</small>
                  )}
                </div>

                {/* PHONE */}
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <select
                      className="country-select"
                      value={country.code}
                      onChange={(e) => {
                        const selected = CountryCodes.find(
                          (c) => c.code === e.target.value,
                        );

                        setCountry(selected);
                      }}
                    >
                      {CountryCodes.map((c, index) => (
                        <option key={index} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-8">
                    <div className="custom-input">
                      <FaPhoneAlt />

                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {errors.phone && (
                  <small className="error-text d-block mb-3">
                    {errors.phone}
                  </small>
                )}

                {/* PIN */}
                <div className="mb-3">
                  <div className="custom-input">
                    <FaLock />

                    <input
                      type={showPin ? "text" : "password"}
                      placeholder="Create PIN"
                      value={form.pin}
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(e) =>
                        handleChange("pin", e.target.value.replace(/\D/g, ""))
                      }
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {errors.pin && (
                    <small className="error-text">{errors.pin}</small>
                  )}
                </div>

                {/* CONFIRM PIN */}
                <div className="mb-4">
                  <div className="custom-input">
                    <FaLock />

                    <input
                      type={showConfirmPin ? "text" : "password"}
                      placeholder="Confirm PIN"
                      value={form.confirmPin}
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(e) =>
                        handleChange("confirmPin", e.target.value.replace(/\D/g, ""))
                      }
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                    >
                      {showConfirmPin ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {errors.confirmPin && (
                    <small className="error-text">{errors.confirmPin}</small>
                  )}
                </div>

                {/* BUTTON */}
                <button className="register-btn w-100" disabled={loading}>
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </form>

              {/* FOOTER */}
              <div className="footer-text">
                Already have an account?
                <Link to="/login" className="login-link">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
