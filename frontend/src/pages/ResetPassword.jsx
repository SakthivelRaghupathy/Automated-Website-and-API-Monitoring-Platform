import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";


function ResetPassword() {
  const navigate = useNavigate();

  const email = sessionStorage.getItem(
    "devguardian_reset_email"
  );

  const otp = sessionStorage.getItem(
    "devguardian_reset_otp"
  );


  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });


  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (!email || !otp) {
      setError(
        "Your password reset session has expired. Please start again."
      );
      return;
    }


    if (formData.new_password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }


    if (formData.new_password.length > 128) {
      setError(
        "Password cannot exceed 128 characters."
      );
      return;
    }


    if (
      formData.new_password !==
      formData.confirm_password
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }


    setLoading(true);


    try {
      const response = await fetch(
        "/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
            new_password:
              formData.new_password,
            confirm_password:
              formData.confirm_password,
          }),
        }
      );


      const data = await response.json();


      console.log(
        "RESET PASSWORD RESPONSE:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Unable to reset your password."
        );
      }


      setSuccess(
        data.message ||
        "Password reset successfully. Redirecting to login..."
      );


      /*
       * Remove temporary recovery data.
       */

      sessionStorage.removeItem(
        "devguardian_reset_email"
      );

      sessionStorage.removeItem(
        "devguardian_reset_otp"
      );


      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to reset your password."
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
            CREATE NEW PASSWORD
          </span>

          <h1>
            Secure your
            <br />
            <span>account again.</span>
          </h1>

          <p>
            Choose a new password that you'll use
            the next time you sign in to Dev Guardian.
          </p>


          <div className="auth-benefits">

            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  Minimum 8 characters
                </strong>

                <span>
                  Create a strong new password.
                </span>
              </div>

            </div>


            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  Confirm your password
                </strong>

                <span>
                  Both password fields must match.
                </span>
              </div>

            </div>


            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  Recovery complete
                </strong>

                <span>
                  You'll return to the login page.
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
              RESET PASSWORD
            </span>

            <h2>
              Create a new password
            </h2>

            <p>
              Set a new password for your Dev Guardian
              account.
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

            {/* NEW PASSWORD */}

            <div className="auth-field">

              <label htmlFor="new_password">
                New password
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  ●
                </span>

                <input
                  id="new_password"
                  name="new_password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.new_password
                  }
                  onChange={handleChange}
                  placeholder="Create a new password"
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <span className="auth-hint">
                Minimum 8 characters
              </span>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="auth-field">

              <label htmlFor="confirm_password">
                Confirm new password
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  ●
                </span>

                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.confirm_password
                  }
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

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
                  Updating password...
                </>
              ) : (
                <>
                  Reset Password
                  <span>→</span>
                </>
              )}

            </button>

          </form>


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


export default ResetPassword;