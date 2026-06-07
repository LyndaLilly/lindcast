import { useEffect, useRef, useState } from "react";

import "../../../../assets/css/register.css";

import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import ApiUrl from "../../../../constants/ApiUrl";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [cooldown, setCooldown] =
    useState(0);

  const [remainingResends, setRemainingResends] =
    useState(null);

  const [error, setError] =
    useState("");

  const inputs = useRef([]);

  // GET OTP
  const getOtp = () => otp.join("");

  // AUTO VERIFY
  useEffect(() => {
    if (getOtp().length === 4) {
      verifyOtp();
    }
  }, [otp]);

  // COUNTDOWN
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  // HANDLE OTP INPUT
  const handleChange = (
    text,
    index
  ) => {
    if (isNaN(Number(text))) return;

    const newOtp = [...otp];

    newOtp[index] = text;

    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  // BACKSPACE
  const handleKeyDown = (
    e,
    index
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  // MASK EMAIL
  const maskEmail = (email) => {
    if (!email) return "";

    const [name, domain] =
      email.split("@");

    const [d, tld] =
      domain.split(".");

    return `${name[0]}***${name.slice(
      -1
    )}@${d[0]}***${d.slice(-1)}.${tld}`;
  };

  // FORMAT TIME
  const formatTime = (s) => {
    const m = Math.floor(s / 60);

    const sec = s % 60;

    return `${m}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    const code = getOtp();

    if (code.length !== 4) return;

    try {
      setLoading(true);

      setError("");

      const response = await fetch(
        ApiUrl.VERIFY_OTP,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            email,
            otp: code,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid OTP"
        );

        setOtp([
          "",
          "",
          "",
          "",
        ]);

        inputs.current[0]?.focus();

        return;
      }

      alert(data.message);

      navigate("/login");

    } catch (error) {
      setError(
        "Network request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const resendOtp = async () => {
    if (
      resending ||
      cooldown > 0
    )
      return;

    try {
      setResending(true);

      const response = await fetch(
        ApiUrl.RESEND_OTP,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data =
        await response.json();

      // TOO MANY REQUESTS
      if (response.status === 429) {
        const seconds =
          parseInt(
            data.cooldown,
            10
          );

        setCooldown(
          Number.isFinite(seconds)
            ? seconds
            : 1200
        );

        setRemainingResends(0);

        alert(data.message);

        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to resend OTP"
        );

        return;
      }

      alert(data.message);

      setOtp([
        "",
        "",
        "",
        "",
      ]);

      inputs.current[0]?.focus();

      setRemainingResends(
        data.remaining_resends
      );

    } catch (error) {
      alert(
        "Network error. Try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="register-page">

      {/* GLOW */}
      <div className="glow glow-1"></div>

      <div className="glow glow-2"></div>

      <div className="container">

        <div className="row justify-content-center align-items-center min-vh-100">

          <div className="col-lg-5 col-md-7 col-sm-11">

            <div className="register-card">

              <div className="register-badge">
                VERIFY EMAIL
              </div>

              <h1 className="register-title">
                Verify Email
              </h1>

              <p className="register-subtitle">
                Enter the 4-digit code sent to your email
              </p>

              <p className="verify-email">
                {maskEmail(email)}
              </p>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {/* OTP BOXES */}
              <div className="otp-container">

                {otp.map(
                  (
                    digit,
                    index
                  ) => (
                    <input
                      key={index}
                      ref={(el) =>
                        (inputs.current[
                          index
                        ] = el)
                      }
                      type="text"
                      maxLength="1"
                      value={digit}
                      className="otp-box"
                      onChange={(e) =>
                        handleChange(
                          e.target.value,
                          index
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          index
                        )
                      }
                    />
                  )
                )}

              </div>

              {/* VERIFY BUTTON */}
              <button
                className="register-btn w-100"
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify"}
              </button>

              {/* RESEND */}
              <div className="text-center mt-4">

                <button
                  className="resend-btn"
                  onClick={resendOtp}
                  disabled={
                    resending ||
                    cooldown > 0
                  }
                >
                  {resending
                    ? "Sending..."
                    : cooldown > 0
                    ? `Try again in ${formatTime(
                        cooldown
                      )}`
                    : "Resend OTP"}
                </button>

                {remainingResends !==
                  null && (
                  <p className="remaining-text">
                    {
                      remainingResends
                    }{" "}
                    resend(s) attempt
                    left
                  </p>
                )}

              </div>

              {/* FOOTER */}
              <div className="footer-text">

                Already have an account?

                <Link
                  to="/login"
                  className="login-link"
                >
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