import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";


function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }


    setLoading(true);


    try {
      const response = await fetch(
        "/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );


      const data = await response.json();

      console.log(
        "FORGOT PASSWORD RESPONSE:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Unable to process your request."
        );
      }


      setSuccess(
        data.message ||
        "A verification code has been sent to your email."
      );


      /*
       * Keep the email for the next
       * verification step.
       */

      sessionStorage.setItem(
        "devguardian_reset_email",
        trimmedEmail
      );


      setTimeout(() => {
        navigate("/verify-otp");
      }, 900);

    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to process your request."
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
            ACCOUNT RECOVERY
          </span>

          <h1>
            Get back
            <br />
            <span>into your workspace.</span>
          </h1>

          <p>
            Don't worry if you forgot your password.
            We'll send a secure verification code to
            your registered email address.
          </p>


          <div className="auth-benefits">

            <div className="auth-benefit">

              <span className="benefit-icon">
                1
              </span>

              <div>
                <strong>
                  Enter your email
                </strong>

                <span>
                  Use the email linked to your account.
                </span>
              </div>

            </div>


            <div className="auth-benefit">

              <span className="benefit-icon">
                2
              </span>

              <div>
                <strong>
                  Verify your OTP
                </strong>

                <span>
                  Enter the 6-digit verification code.
                </span>
              </div>

            </div>


            <div className="auth-benefit">

              <span className="benefit-icon">
                3
              </span>

              <div>
                <strong>
                  Create a new password
                </strong>

                <span>
                  Secure your account again.
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
              PASSWORD RECOVERY
            </span>

            <h2>
              Forgot your password?
            </h2>

            <p>
              Enter your registered email and we'll
              send you a verification code.
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

              <label htmlFor="forgot-email">
                Email address
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Sending code...
                </>
              ) : (
                <>
                  Send Verification Code
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          <div className="auth-divider">
            <span>
              Remember your password?
            </span>
          </div>


          <Link
            to="/login"
            className="auth-secondary-button"
          >
            Back to Sign In
          </Link>


          <Link
            to="/"
            className="auth-back-link"
          >
            ← Back to Dev Guardian
          </Link>

        </div>

      </section>

    </main>
  );
}


export default ForgotPassword;