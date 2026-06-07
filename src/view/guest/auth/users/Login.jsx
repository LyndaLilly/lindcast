import { useState } from "react";

import "../../../../assets/css/register.css";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../../../contexts/AuthContext"


export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPin, setShowPin] =
    useState(false);

  const [form, setForm] = useState({
    email: "chijinduorakwe@gmail.com",
    pin: "1234",
  });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  // HANDLE INPUT
  const handleChange = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email =
        "Email is required";
    }

    if (!form.pin) {
      newErrors.pin =
        "PIN is required";
    }

    if (
      form.pin.length !== 4
    ) {
      newErrors.pin =
        "PIN must be exactly 4 digits";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  // LOGIN
  const handleLogin = async (
    e
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      setErrors({});

      const res =
        await login(
          form.email,
          form.pin
        );

      // ❌ EMAIL NOT VERIFIED
      // EXACT APP FLOW
      if (
        !res.success &&
        res.verified === false
      ) {
        setLoading(false);

        navigate(
          "/verify-email",
          {
            state: {
              email:
                form.email,
            },
          }
        );

        return;
      }

      // ❌ LOGIN FAILED
      if (!res.success) {
        setLoading(false);

        setErrors({
          general:
            res.message,
        });

        return;
      }

      // ✅ SAVE LAST EMAIL
      localStorage.setItem(
        "last_login_email",
        form.email
      );

      setLoading(false);

      alert(
        "Login Successful"
      );

      // REDIRECT HOME
      navigate("/");

    } catch (error) {
      console.log(error);

      setLoading(false);

      setErrors({
        general:
          "Something went wrong",
      });
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

              {/* BADGE */}
              <div className="register-badge">
                WELCOME BACK
              </div>

              {/* TITLE */}
              <h1 className="register-title">
                Login Account
              </h1>

              <p className="register-subtitle">
                Login to continue
              </p>

              <form onSubmit={handleLogin}>

                {/* GENERAL ERROR */}
                {errors.general && (
                  <div className="alert alert-danger">
                    {
                      errors.general
                    }
                  </div>
                )}

                {/* EMAIL */}
                <div className="mb-3">

                  <div className="custom-input">

                    <FaEnvelope />

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={
                        form.email
                      }
                      onChange={(e) =>
                        handleChange(
                          "email",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {errors.email && (
                    <small className="error-text">
                      {
                        errors.email
                      }
                    </small>
                  )}

                </div>

                {/* PIN */}
                <div className="mb-4">

                  <div className="custom-input">

                    <FaLock />

                    <input
                      type={
                        showPin
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter PIN"
                      value={
                        form.pin
                      }
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(e) =>
                        handleChange(
                          "pin",
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() =>
                        setShowPin(
                          !showPin
                        )
                      }
                    >
                      {showPin ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                  {errors.pin && (
                    <small className="error-text">
                      {errors.pin}
                    </small>
                  )}

                </div>

                {/* LOGIN BUTTON */}
                <button
                  className="register-btn w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}
                </button>

              </form>

              {/* FOOTER */}
              <div className="footer-text">

                Don't have an account?

                <Link
                  to="/register"
                  className="login-link"
                >
                  Register
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}