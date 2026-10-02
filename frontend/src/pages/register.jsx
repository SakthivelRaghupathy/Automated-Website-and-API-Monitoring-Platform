import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";


function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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


  const validateForm = () => {
    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirm_password;


    if (username.length < 3) {
      return "Username must contain at least 3 characters.";
    }

    if (username.length > 50) {
      return "Username cannot exceed 50 characters.";
    }


    if (!email) {
      return "Please enter your email address.";
    }


    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (password.length > 128) {
      return "Password cannot exceed 128 characters.";
    }


    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }


    return null;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }


    setLoading(true);


    const registerData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirm_password: formData.confirm_password,
    };


    console.log(
      "REGISTER DATA:",
      registerData
    );


    try {
      const response = await fetch(
        "/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(registerData),
        }
      );


      const data = await response.json();


      console.log(
        "REGISTER RESPONSE:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Unable to create your account."
        );
      }


      setSuccess(
        "Account created successfully. Redirecting to login..."
      );


      setFormData({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      });


      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to create your account."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="auth-page">

      {/* =====================================
          BACKGROUND
          ===================================== */}

      <div className="auth-background">

        <div className="auth-grid"></div>

        <div className="auth-glow auth-glow-one"></div>

        <div className="auth-glow auth-glow-two"></div>

      </div>


      {/* =====================================
          LEFT BRAND PANEL
          ===================================== */}

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
            DEVELOPER QUALITY PLATFORM
          </span>

          <h1>
            Build better.
            <br />
            <span>Ship with confidence.</span>
          </h1>

          <p>
            Create your Dev Guardian account and
            start monitoring, testing, automating,
            and improving your projects from one
            place.
          </p>


          <div className="auth-benefits">

            <div className="auth-benefit">
              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  Project Monitoring
                </strong>

                <span>
                  Monitor websites and APIs.
                </span>
              </div>
            </div>


            <div className="auth-benefit">
              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  QA Automation
                </strong>

                <span>
                  Test your applications automatically.
                </span>
              </div>
            </div>


            <div className="auth-benefit">
              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  Reports & Insights
                </strong>

                <span>
                  Keep your quality results organized.
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


      {/* =====================================
          REGISTER PANEL
          ===================================== */}

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
              GET STARTED
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Start using Dev Guardian to improve
              your development workflow.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="auth-alert auth-alert-error">
              <span>!</span>

              <p>
                {error}
              </p>
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="auth-alert auth-alert-success">
              <span>✓</span>

              <p>
                {success}
              </p>
            </div>
          )}


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* USERNAME */}

            <div className="auth-field">

              <label htmlFor="username">
                Username
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  minLength={3}
                  maxLength={50}
                  autoComplete="username"
                  required
                />

              </div>

              <span className="auth-hint">
                3–50 characters
              </span>

            </div>


            {/* EMAIL */}

            <div className="auth-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="auth-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  ●
                </span>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              <span className="auth-hint">
                Minimum 8 characters
              </span>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="auth-field">

              <label htmlFor="confirm_password">
                Confirm password
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
                  placeholder="Confirm your password"
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
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>

          </form>


          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>


          <Link
            to="/login"
            className="auth-secondary-button"
          >
            Sign in to Dev Guardian
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


export default Register;