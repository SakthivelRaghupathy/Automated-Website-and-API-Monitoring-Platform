import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    const username = formData.username.trim();
    const password = formData.password;


    if (!username) {
      setError("Please enter your username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }


    setLoading(true);


    const loginData = {
      username,
      password,
    };


    console.log(
      "LOGIN DATA:",
      loginData
    );


    try {
      const response = await fetch(
        "/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(loginData),
        }
      );


      const data = await response.json();


      console.log(
        "LOGIN RESPONSE:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Unable to login."
        );
      }


      /*
       * Store JWT for authenticated
       * API requests later.
       */

      localStorage.setItem(
        "devguardian_access_token",
        data.access_token
      );


      localStorage.setItem(
        "devguardian_token_type",
        data.token_type || "bearer"
      );


      setSuccess(
        "Login successful. Redirecting..."
      );


      /*
       * Give the user a moment to see
       * the success state.
       */

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to login. Please try again."
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
            WELCOME BACK
          </span>

          <h1>
            Your projects.
            <br />

            <span>Your quality.</span>
            <br />

            Under control.
          </h1>


          <p>
            Sign in to your Dev Guardian workspace
            and continue monitoring, testing, and
            improving your applications.
          </p>


          <div className="auth-benefits">

            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>

                <strong>
                  Monitor Your Projects
                </strong>

                <span>
                  Track websites and API health.
                </span>

              </div>

            </div>


            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>

                <strong>
                  Automate Quality Checks
                </strong>

                <span>
                  Run tests and automation workflows.
                </span>

              </div>

            </div>


            <div className="auth-benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>

                <strong>
                  Review Your Reports
                </strong>

                <span>
                  Keep your project quality visible.
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
          LOGIN PANEL
          ===================================== */}

      <section className="auth-form-section">

        <div className="auth-card">


          {/* Mobile logo */}

          <div className="auth-mobile-logo">

            <div className="auth-logo-icon">
              &lt;/&gt;
            </div>

            <strong>
              Dev Guardian
            </strong>

          </div>


          {/* Heading */}

          <div className="auth-heading">

            <span className="auth-card-label">
              SIGN IN
            </span>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue to your Dev Guardian
              workspace.
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="auth-alert auth-alert-error">

              <span>
                !
              </span>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* Success */}

          {success && (
            <div className="auth-alert auth-alert-success">

              <span>
                ✓
              </span>

              <p>
                {success}
              </p>

            </div>
          )}


          {/* =====================================
              LOGIN FORM
              ===================================== */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >


            {/* USERNAME */}

            <div className="auth-field">

              <label htmlFor="login-username">
                Username
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="login-username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="auth-field">

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                <label htmlFor="login-password">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  style={{
                    color: "#155eef",
                    fontSize: "11px",
                    fontWeight: 650,
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>

              </div>


              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  ●
                </span>

                <input
                  id="login-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="auth-spinner"></span>

                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <span>
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div className="auth-divider">
            <span>
              Don't have an account?
            </span>
          </div>


          <Link
            to="/register"
            className="auth-secondary-button"
          >
            Create a Dev Guardian account
          </Link>


          {/* BACK */}

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


export default Login;