import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("devguardian-theme") === "dark";
  });
  const [contactForm, setContactForm] = useState({
  name: "",
  email: "",
  subject: "",
  message: "",
});

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", darkMode);

    localStorage.setItem(
      "devguardian-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <div className="landing">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <Link to="/" className="brand">
          <div className="brand-logo">
            &lt;/&gt;
          </div>

          <div className="brand-text">
            <h2>Dev Guardian</h2>
            <span>Analyze · Secure · Improve</span>
          </div>
        </Link>

        <nav className="desktop-nav">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#developers">For Developers</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navbar-actions">

          <button
            className="theme-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <Link to="/login" className="nav-login">
            Login
          </Link>

          <Link to="/register" className="nav-start">
            Get Started
          </Link>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <main>

        <section className="hero" id="home">

          <div className="hero-left">

            <div className="hero-badge">
              Your Project's Guardian
            </div>

            <h1>
              Build Better.
              <br />
              <span>Ship Safer.</span>
            </h1>

            <p className="hero-description">
              Dev Guardian helps developers monitor websites,
              collect useful web data, automate quality checks,
              test APIs and UI workflows, and maintain reliable
              software with confidence.
            </p>

            <div className="hero-actions">

              <Link to="/register" className="primary-button">
                Get Started
                <span>→</span>
              </Link>

              <Link to="/login" className="secondary-button">
                Login
              </Link>

            </div>

            <div className="hero-benefits">

              <div className="benefit">
                <div className="benefit-icon">◉</div>
                <div>
                  <strong>Built for</strong>
                  <span>Developers</span>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">✓</div>
                <div>
                  <strong>Secure &</strong>
                  <span>Reliable</span>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">⚡</div>
                <div>
                  <strong>Simple &</strong>
                  <span>Easy to Use</span>
                </div>
              </div>

            </div>

          </div>


          {/* ================= DASHBOARD PREVIEW ================= */}

          <div className="hero-right">

            <div className="dashboard-window">

              <div className="dashboard-header">

                <div className="dashboard-brand">

                  <div className="mini-logo">
                    &lt;/&gt;
                  </div>

                  <strong>
                    Dev Guardian
                  </strong>

                </div>

                <div className="dashboard-user">
                  <span>●</span>
                  Developer
                </div>

              </div>


              <div className="dashboard-body">

                <aside className="dashboard-sidebar">

                  <div className="sidebar-item active">
                    <span>⌂</span>
                    Dashboard
                  </div>

                  <div className="sidebar-item">
                    <span>◉</span>
                    Monitoring
                  </div>

                  <div className="sidebar-item">
                    <span>⌕</span>
                    Data Collection
                  </div>

                  <div className="sidebar-item">
                    <span>✓</span>
                    Testing
                  </div>

                  <div className="sidebar-item">
                    <span>◈</span>
                    Reports
                  </div>

                </aside>


                <div className="dashboard-content">

                  <div className="dashboard-title">

                    <div>
                      <h3>Project Overview</h3>

                      <p>
                        Your project's health at a glance
                      </p>
                    </div>

                    <span className="status-dot">
                      ● Healthy
                    </span>

                  </div>


                  <div className="dashboard-grid">

                    <div className="health-card">

                      <div>

                        <span className="card-label">
                          Project Health
                        </span>

                        <div className="health-score">
                          92
                          <small>/100</small>
                        </div>

                      </div>

                      <div className="health-info">

                        <strong>
                          Great Job!
                        </strong>

                        <p>
                          Your project is healthy.
                        </p>

                      </div>

                    </div>


                    <div className="actions-card">

                      <span className="card-label">
                        Quick Actions
                      </span>

                      <button>
                        ▶ Run Test
                      </button>

                      <button>
                        ◈ Generate Report
                      </button>

                      <button>
                        ✓ Check Website
                      </button>

                    </div>

                  </div>


                  <div className="status-grid">

                    <div className="status-card">
                      <span className="status-icon green">
                        ✓
                      </span>

                      <div>
                        <strong>
                          Monitoring
                        </strong>

                        <span className="healthy">
                          Operational
                        </span>
                      </div>
                    </div>


                    <div className="status-card">
                      <span className="status-icon blue">
                        ✓
                      </span>

                      <div>
                        <strong>
                          API Tests
                        </strong>

                        <span className="healthy">
                          Passing
                        </span>
                      </div>
                    </div>


                    <div className="status-card">
                      <span className="status-icon purple">
                        ◈
                      </span>

                      <div>
                        <strong>
                          UI Tests
                        </strong>

                        <span className="healthy">
                          Passing
                        </span>
                      </div>
                    </div>


                    <div className="status-card">
                      <span className="status-icon orange">
                        &lt;/&gt;
                      </span>

                      <div>
                        <strong>
                          Data Collection
                        </strong>

                        <span className="healthy">
                          Complete
                        </span>
                      </div>
                    </div>

                  </div>


                  <div className="analysis-section">

                    <div>

                      <span className="card-label">
                        Recent Runs
                      </span>

                      <div className="analysis-row">
                        <span>UI Test Suite</span>
                        <b>Passed</b>
                      </div>

                      <div className="analysis-row">
                        <span>API Test Suite</span>
                        <b>Passed</b>
                      </div>

                      <div className="analysis-row">
                        <span>Website Monitor</span>
                        <b>Healthy</b>
                      </div>

                    </div>


                    <div className="insights">

                      <span className="card-label">
                        Project Metrics
                      </span>

                      <div className="bar">
                        <span>Tests Passed</span>
                        <i style={{ width: "92%" }} />
                      </div>

                      <div className="bar">
                        <span>Website Health</span>
                        <i style={{ width: "96%" }} />
                      </div>

                      <div className="bar">
                        <span>API Reliability</span>
                        <i style={{ width: "88%" }} />
                      </div>

                      <div className="bar">
                        <span>Automation</span>
                        <i style={{ width: "90%" }} />
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            <div className="terminal-card">

              <div>
                $ devguardian run
              </div>

              <span>
                ✓ Monitoring website...
              </span>

              <span>
                ✓ Running API tests...
              </span>

              <span>
                ✓ Running UI tests...
              </span>

              <span>
                ✓ Generating report...
              </span>

              <strong>
                All checks completed!
              </strong>

            </div>

          </div>

        </section>


        {/* ================= FEATURES ================= */}

        <section className="features" id="features">

          <span className="section-label">
            CORE CAPABILITIES
          </span>

          <h2>
            Everything You Need to Maintain Better Projects
          </h2>

          <p className="section-description">
            Dev Guardian brings monitoring, automation, testing
            and data collection into one developer-focused platform.
          </p>


          <div className="feature-grid">

            <div className="feature-card">
              <div className="feature-icon">◉</div>

              <h3>
                Website Monitoring
              </h3>

              <p>
                Monitor website availability, HTTP status,
                response time and SSL information.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">⌕</div>

              <h3>
                Data Collection
              </h3>

              <p>
                Collect page titles, metadata, headings,
                links and other useful website information.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">✓</div>

              <h3>
                QA Automation
              </h3>

              <p>
                Automate browser workflows and validate
                important user interface behavior.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">⚡</div>

              <h3>
                API Testing
              </h3>

              <p>
                Test REST APIs and validate responses,
                status codes and API behavior.
              </p>
            </div>

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}

        <section className="how-section" id="how-it-works">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            From Project to Insight
          </h2>

          <p className="section-description">
            Create a project, automate your checks and
            understand the results from one place.
          </p>


          <div className="steps">

            <div className="step">

              <span>01</span>

              <h3>
                Add Your Project
              </h3>

              <p>
                Create a project and add the website or API
                you want Dev Guardian to work with.
              </p>

            </div>


            <div className="step">

              <span>02</span>

              <h3>
                Run Automation
              </h3>

              <p>
                Run monitoring, data collection, API tests
                and browser automation whenever you need.
              </p>

            </div>


            <div className="step">

              <span>03</span>

              <h3>
                Review Results
              </h3>

              <p>
                Review test results, reports, logs and
                project health from your dashboard.
              </p>

            </div>

          </div>

        </section>


        {/* ================= FOR DEVELOPERS ================= */}

        <section
          className="developers-section"
          id="developers"
        >

          <div className="developers-content">

            <div className="developers-text">

              <span className="section-label">
                FOR DEVELOPERS
              </span>

              <h2>
                Built Around the Developer Workflow
              </h2>

              <p>
                Dev Guardian is designed to reduce repetitive
                development and testing work while keeping
                important project information in one place.
              </p>

              <p>
                Instead of manually checking websites, running
                the same browser tests, validating APIs and
                collecting reports, developers can organize
                these activities through a single platform.
              </p>

              <Link
                to="/register"
                className="developer-button"
              >
                Start Building →
              </Link>

            </div>


            <div className="developer-points">

              <div className="developer-point">

                <div className="point-number">
                  01
                </div>

                <div>
                  <h3>
                    Automate Repetitive Work
                  </h3>

                  <p>
                    Schedule recurring monitoring and testing
                    tasks instead of performing them manually.
                  </p>
                </div>

              </div>


              <div className="developer-point">

                <div className="point-number">
                  02
                </div>

                <div>
                  <h3>
                    Keep Results Organized
                  </h3>

                  <p>
                    Store project checks, test results and
                    generated reports in one centralized system.
                  </p>
                </div>

              </div>


              <div className="developer-point">

                <div className="point-number">
                  03
                </div>

                <div>
                  <h3>
                    Understand Your Projects
                  </h3>

                  <p>
                    Use dashboards and reports to quickly
                    understand what is working and what needs
                    attention.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= ABOUT ================= */}

        <section
          className="about-section"
          id="about"
        >

          <div className="about-card">

            <div className="about-heading">

              <span className="section-label">
                ABOUT DEV GUARDIAN
              </span>

              <h2>
                A Developer-Focused Quality Platform
              </h2>

            </div>


            <div className="about-content">

              <p>
                Dev Guardian is a developer-focused platform
                built to bring project monitoring, web data
                collection, API testing, UI automation and
                reporting into one workflow.
              </p>

              <p>
                The goal is simple: help developers spend less
                time performing repetitive checks and more time
                building reliable software.
              </p>

              <p>
                The platform combines Python-based backend
                services, automated testing, web technologies,
                scheduling and reporting to provide a practical
                environment for managing software quality.
              </p>

            </div>


            <div className="about-stats">

              <div>
                <strong>Python</strong>
                <span>Backend</span>
              </div>

              <div>
                <strong>Playwright</strong>
                <span>UI Automation</span>
              </div>

              <div>
                <strong>Pytest</strong>
                <span>Testing</span>
              </div>

              <div>
                <strong>PostgreSQL</strong>
                <span>Data Storage</span>
              </div>

            </div>

          </div>

        </section>


        {/* ================= CONTACT ================= */}

        <section
          className="contact-section"
          id="contact"
        >

          <div className="contact-container">

            <div className="contact-info">

              <span className="section-label">
                CONTACT
              </span>

              <h2>
                Have a Question?
              </h2>

              <p>
                Interested in Dev Guardian or want to know
                more about the platform? Send us a message.
              </p>

              <div className="contact-detail">

                <span className="contact-icon">
                  @
                </span>

                <div>
                  <strong>Email</strong>
                  <span>
                    support@devguardian.local
                  </span>
                </div>

              </div>


              <div className="contact-detail">

                <span className="contact-icon">
                  ◉
                </span>

                <div>
                  <strong>Platform</strong>
                  <span>
                    Developer Quality & Automation
                  </span>
                </div>

              </div>

            </div>


            <form
  className="contact-form"
  onSubmit={async (event) => {
    event.preventDefault();

    console.log("CONTACT FORM SUBMITTED");

    const contactData = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      subject: contactForm.subject.trim(),
      message: contactForm.message.trim(),
    };

    console.log("DATA BEING SENT TO BACKEND:");
    console.log(contactData);

    if (
      !contactData.name ||
      !contactData.email ||
      !contactData.subject ||
      !contactData.message
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        "/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );

      console.log("Backend status:", response.status);

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to send your message."
        );
      }

      alert(data.message);

      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      console.error("CONTACT FORM ERROR:", error);

      alert(
        error.message ||
        "Unable to send your message. Please try again."
      );
    }
  }}
>
  <div className="contact-form-row">

    <div className="contact-field">
      <label htmlFor="contact-name">
        Name
      </label>

      <input
        id="contact-name"
        type="text"
        value={contactForm.name}
        onChange={(event) =>
          setContactForm({
            ...contactForm,
            name: event.target.value,
          })
        }
        placeholder="Your name"
        required
      />
    </div>

    <div className="contact-field">
      <label htmlFor="contact-email">
        Email
      </label>

      <input
        id="contact-email"
        type="email"
        value={contactForm.email}
        onChange={(event) =>
          setContactForm({
            ...contactForm,
            email: event.target.value,
          })
        }
        placeholder="you@example.com"
        required
      />
    </div>

  </div>

  <div className="contact-field">
    <label htmlFor="contact-subject">
      Subject
    </label>

    <input
      id="contact-subject"
      type="text"
      value={contactForm.subject}
      onChange={(event) =>
        setContactForm({
          ...contactForm,
          subject: event.target.value,
        })
      }
      placeholder="How can we help?"
      required
    />
  </div>

  <div className="contact-field">
    <label htmlFor="contact-message">
      Message
    </label>

    <textarea
      id="contact-message"
      value={contactForm.message}
      onChange={(event) =>
        setContactForm({
          ...contactForm,
          message: event.target.value,
        })
      }
      placeholder="Write your message..."
      rows="5"
      required
    />
  </div>

  <button
    type="submit"
    className="contact-button"
  >
    Send Message →
  </button>
</form>


          </div>

        </section>


        {/* ================= CTA ================= */}

        <section className="cta-section">

          <h2>
            Ready to Build Better Software?
          </h2>

          <p>
            Start monitoring, testing and automating your
            projects with Dev Guardian.
          </p>

          <Link
            to="/register"
            className="cta-button"
          >
            Get Started →
          </Link>

        </section>


        {/* ================= FOOTER ================= */}

        <footer className="footer">

          <div className="footer-brand">

            <div className="footer-logo">
              &lt;/&gt;
            </div>

            <div>
              <strong>
                Dev Guardian
              </strong>

              <p>
                Analyze · Secure · Improve
              </p>
            </div>

          </div>


          <div className="footer-links">

            <a href="#home">
              Home
            </a>

            <a href="#features">
              Features
            </a>

            <a href="#developers">
              Developers
            </a>

            <a href="#about">
              About
            </a>

            <a href="#contact">
              Contact
            </a>

          </div>


          <div className="footer-right">

            <span>
              © 2026 Dev Guardian
            </span>

            <span>
              Built for developers
            </span>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default Landing;