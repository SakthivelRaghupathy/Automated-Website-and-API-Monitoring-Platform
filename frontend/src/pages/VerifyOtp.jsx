import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";


function VerifyOtp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    const storedEmail = sessionStorage.getItem(
      "devguardian_reset_email"
    );

    if (!storedEmail) {
      navigate("/forgot-password");
      return;
    }

    setEmail(storedEmail);
  }, [navigate]);


  const handleOtpChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
    setError("");
    setSuccess("");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }


    setLoading(true);


    try {
      const response = await fetch(
        "/auth/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );


      const data = await response.json();


      console.log(
        "VERIFY OTP RESPONSE:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Invalid or expired verification code."
        );
      }


      /*
       * Backend returns:
       * { verified: true }
       */

      if (!data.verified) {
        throw new Error(
          "Verification failed."
        );
      }


      sessionStorage.setItem(
        "devguardian_reset_otp",
        otp
      );


      setSuccess(
        "OTP verified successfully."
      );


      setTimeout(() => {
        navigate("/reset-password");
      }, 700);

    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to verify the code."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="auth-page">

      <div className="auth-background">
        <div className="auth-grid"></div>

        <div className="auth-glow auth-glow-one"></div>

        <div className="auth-glow auth-glow-two"></div>
      </div>


      {/* BRAND */}

      <section className="auth-brand">

        <Link
          to="/"
          className="auth-brand-logo"
        >

          <div className="auth-logo-icon">
            &lt;/&gt;
          </div>

          <div>
            <strong>
              Dev Guardian
            </strong>

            <span>
              Analyze · Secure · Improve
            </span>
          </div>

        </Link>


        <div className="auth-brand-content">

          <span className="auth-eyebrow">
            VERIFY YOUR ACCOUNT
          </span>

          <h1>
            One more
            <br />
            <span>step.</span>
          </h1>

          <p>
            Check your registered email for the
            verification code we sent you.
          </p>


          <div className="auth-benefits">

            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  6-digit OTP
                </strong>

                <span>
                  Enter the code from your email.
                </span>
              </div>

            </div>


            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  Time-limited
                </strong>

                <span>
                  Your verification code expires after
                  10 minutes.
                </span>
              </div>

            </div>


            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  Secure recovery
                </strong>

                <span>
                  Your new password is securely stored.
                </span>
              </div>

            </div>

          </div>

        </div>


        <div className="auth-brand-footer">
          © 2026 Dev Guardian · Developer Quality &
          Automation
        </div>

      </section>


      {/* FORM */}

      <section className="auth-form-section">

        <div className="auth-card">

          <div className="auth-mobile-logo">

            <div className="auth-logo-icon">
              &lt;/&gt;
            </div>

            <strong>
              Dev Guardian
            </strong>

          </div>


          <div className="auth-heading">

            <span className="auth-card-label">
              VERIFICATION
            </span>

            <h2>
              Enter your OTP
            </h2>

            <p>
              We sent a 6-digit verification code to
              <br />
              <strong>{email}</strong>
            </p>

          </div>


          {error && (
            <div className="auth-alert auth-alert-error">

              <span>!</span>

              <p>{error}</p>

            </div>
          )}


          {success && (
            <div className="auth-alert auth-alert-success">

              <span>✓</span>

              <p>{success}</p>

            </div>
          )}


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="auth-field">

              <label htmlFor="otp">
                Verification code
              </label>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                maxLength={6}
                required
                style={{
                  width: "100%",
                  height: "58px",
                  padding: "0 18px",
                  border: "1px solid #d7e0ec",
                  borderRadius: "9px",
                  background: "#ffffff",
                  color: "#14244a",
                  fontSize: "24px",
                  fontWeight: "700",
                  letterSpacing: "0.35em",
                  textAlign: "center",
                  outline: "none",
                }}
              />

              <span className="auth-hint">
                Enter the 6-digit code from your email.
              </span>

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Code
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          <div className="auth-divider">
            <span>
              Wrong email?
            </span>
          </div>


          <Link
            to="/forgot-password"
            className="auth-secondary-button"
          >
            Change Email
          </Link>


          <Link
            to="/login"
            className="auth-back-link"
          >
            ← Back to Sign In
          </Link>

        </div>

      </section>

    </main>
  );
}


export default VerifyOtp;