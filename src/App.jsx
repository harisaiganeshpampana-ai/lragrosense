import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Droplets,
  Leaf,
  Menu,
  Microscope,
  Radio,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Thermometer,
  X,
  Zap,
} from "lucide-react";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    closeMobileMenu();
  };

  return (
    <div className="site">

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <header className="navbar">
        <div className="container navbar-inner">

          <button
            className="brand"
            onClick={() => scrollToSection("home")}
            aria-label="Go to LR AgroSense home"
          >
            <img
              src="/company_logo.jpg"
              alt="LR AgroSense"
              className="brand-logo"
            />

            <span>LR AgroSense</span>
          </button>

          <nav
            className={`nav-links ${
              mobileMenuOpen ? "nav-open" : ""
            }`}
          >
            <button onClick={() => scrollToSection("about")}>
              About
            </button>

            <button onClick={() => scrollToSection("products")}>
              Products
            </button>

            <button onClick={() => scrollToSection("technology")}>
              Technology
            </button>

            <button onClick={() => scrollToSection("research")}>
              Research
            </button>

            <button onClick={() => scrollToSection("roadmap")}>
              Roadmap
            </button>

            <button onClick={() => scrollToSection("internships")}>
              Internships
            </button>

            {/* Separate LR AI application */}
            <a
              href="/lr-ai.html"
              className="lr-ai-nav"
              onClick={closeMobileMenu}
            >
              <Sparkles size={15} />
              LR AI
            </a>

            <button
              className="nav-connect"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </button>
          </nav>

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen((value) => !value)
            }
            aria-label={
              mobileMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>
      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <main>

        <section id="home" className="hero-section">
          <div className="container hero-content">

            <div className="hero-copy">

              <div className="eyebrow">
                <span className="eyebrow-dot" />
                AGRITECH • IOT • AI
              </div>

              <h1>
                Smarter farming.
                <br />
                <span>Better decisions.</span>
              </h1>

              <p>
                LR AgroSense is building affordable agricultural
                technologies that help farmers understand their
                fields, use resources efficiently, and move
                toward more sustainable farming.
              </p>

              <div className="hero-actions">

                <button
                  className="primary-button"
                  onClick={() => scrollToSection("products")}
                >
                  Explore our technology
                  <ArrowRight size={17} />
                </button>

                {/* Opens separate LR AI application */}
                <a
                  href="/lr-ai.html"
                  className="secondary-button"
                >
                  <Sparkles size={17} />
                  Try LR AI
                </a>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            ABOUT
            ===================================================== */}

        <section id="about" className="section">
          <div className="container">

            <div className="section-heading">
              <span>ABOUT LR AGROSENSE</span>

              <h2>
                Technology designed around
                real agricultural problems.
              </h2>

              <p>
                We are building practical and affordable
                solutions for farmers by combining agriculture,
                IoT, data and artificial intelligence.
              </p>
            </div>

            <div className="about-grid">

              <article className="info-card">
                <Sprout size={25} />

                <h3>Farmer First</h3>

                <p>
                  Our technology starts with real problems
                  faced by farmers and focuses on solutions
                  that can be practical in the field.
                </p>
              </article>

              <article className="info-card">
                <Microscope size={25} />

                <h3>Research Driven</h3>

                <p>
                  We believe agricultural technology should
                  be tested, validated and improved before
                  making strong claims.
                </p>
              </article>

              <article className="info-card">
                <Target size={25} />

                <h3>Affordable Innovation</h3>

                <p>
                  Our long-term goal is to make useful
                  agricultural technology accessible to
                  farmers of different scales.
                </p>
              </article>

            </div>

          </div>
        </section>

        {/* =====================================================
            PRODUCTS
            ===================================================== */}

        <section
          id="products"
          className="section section-soft"
        >
          <div className="container">

            <div className="section-heading">
              <span>OUR PRODUCT DIRECTION</span>

              <h2>
                Building an intelligent
                agricultural ecosystem.
              </h2>

              <p>
                Our product roadmap combines field sensing,
                weather intelligence and AI-assisted
                agricultural decision support.
              </p>
            </div>

            <div className="product-grid">

              {/* Product 1 */}

              <article className="product-card featured-product">

                <div className="product-icon">
                  <Droplets size={23} />
                </div>

                <h3>
                  Smart Farm Monitor
                </h3>

                <p>
                  A low-cost monitoring system designed to
                  collect important soil and field parameters
                  and provide useful information to farmers.
                </p>

                <span className="product-status">
                  In Development
                </span>

              </article>

              {/* Product 2 */}

              <article className="product-card">

                <div className="product-icon">
                  <Sparkles size={23} />
                </div>

                <h3>
                  LR AI
                </h3>

                <p>
                  An independent AI platform designed to help
                  users understand plants and crops using
                  images, questions and agricultural
                  intelligence.
                </p>

                <a
                  href="/lr-ai.html"
                  className="text-button"
                >
                  Open LR AI
                  <ArrowRight size={15} />
                </a>

              </article>

              {/* Product 3 */}

              <article className="product-card">

                <div className="product-icon">
                  <Cloud size={23} />
                </div>

                <h3>
                  Smart Farm Station
                </h3>

                <p>
                  A future field station combining soil,
                  weather and environmental measurements
                  for better farm intelligence.
                </p>

                <span className="product-status">
                  Research
                </span>

              </article>

            </div>

          </div>
        </section>

        {/* =====================================================
            TECHNOLOGY
            ===================================================== */}

        <section
          id="technology"
          className="section"
        >
          <div className="container">

            <div className="section-heading">
              <span>TECHNOLOGY</span>

              <h2>
                Connecting the field
                with intelligent software.
              </h2>

              <p>
                LR AgroSense is exploring a combination of
                sensors, connectivity, cloud systems and
                artificial intelligence.
              </p>
            </div>

            <div className="technology-grid">

              <article>
                <Droplets size={25} />

                <h3>Soil Monitoring</h3>

                <p>
                  Monitor parameters such as soil moisture,
                  pH, temperature and other measurable
                  characteristics.
                </p>
              </article>

              <article>
                <Radio size={25} />

                <h3>IoT Connectivity</h3>

                <p>
                  Connect field devices to software platforms
                  for remote data collection and monitoring.
                </p>
              </article>

              <article>
                <Thermometer size={25} />

                <h3>Weather Intelligence</h3>

                <p>
                  Future systems can combine weather data
                  with field information to improve
                  agricultural decisions.
                </p>
              </article>

              <article>
                <Sparkles size={25} />

                <h3>Artificial Intelligence</h3>

                <p>
                  AI can help interpret agricultural data,
                  images and farmer questions to provide
                  useful decision support.
                </p>
              </article>

            </div>

          </div>
        </section>

        {/* =====================================================
            RESEARCH
            ===================================================== */}

        <section
          id="research"
          className="section section-dark"
        >
          <div className="container">

            <div className="section-heading light-heading">
              <span>RESEARCH & DEVELOPMENT</span>

              <h2>
                We investigate before
                we promise.
              </h2>

              <p>
                Agriculture is complex. A symptom seen on a
                plant can have several possible causes.
                Our approach is to combine multiple sources
                of information and validate important
                recommendations.
              </p>
            </div>

            <div className="research-list">

              <div>
                <CheckCircle2 size={17} />
                Soil data
              </div>

              <div>
                <CheckCircle2 size={17} />
                Crop information
              </div>

              <div>
                <CheckCircle2 size={17} />
                Weather conditions
              </div>

              <div>
                <CheckCircle2 size={17} />
                Plant images
              </div>

              <div>
                <CheckCircle2 size={17} />
                Field observations
              </div>

              <div>
                <CheckCircle2 size={17} />
                Agricultural research
              </div>

              <div>
                <CheckCircle2 size={17} />
                Soil testing
              </div>

              <div>
                <CheckCircle2 size={17} />
                Expert validation
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            ROADMAP
            ===================================================== */}

        <section
          id="roadmap"
          className="section"
        >
          <div className="container">

            <div className="section-heading">
              <span>ROADMAP</span>

              <h2>
                From a smart monitor
                to intelligent farming.
              </h2>

              <p>
                LR AgroSense is being developed step by step,
                starting with practical field technology and
                gradually expanding into AI-driven agriculture.
              </p>
            </div>

            <div className="roadmap">

              <article className="roadmap-item">

                <span>01</span>

                <div>
                  <h3>
                    Smart Farm Monitor
                  </h3>

                  <p>
                    Develop and validate an affordable
                    agricultural monitoring device for
                    important soil and field parameters.
                  </p>
                </div>

              </article>

              <article className="roadmap-item">

                <span>02</span>

                <div>
                  <h3>
                    Field Intelligence
                  </h3>

                  <p>
                    Combine soil, weather and crop information
                    to create more useful farm-level insights.
                  </p>
                </div>

              </article>

              <article className="roadmap-item">

                <span>03</span>

                <div>
                  <h3>
                    AI Agriculture
                  </h3>

                  <p>
                    Develop intelligent systems that can help
                    identify crop health problems and support
                    farmers with better information.
                  </p>
                </div>

              </article>

              <article className="roadmap-item">

                <span>04</span>

                <div>
                  <h3>
                    Precision Agriculture
                  </h3>

                  <p>
                    Build advanced technologies for more
                    efficient use of water, nutrients and
                    agricultural inputs.
                  </p>
                </div>

              </article>

            </div>

          </div>
        </section>

        {/* =====================================================
            INTERNSHIPS
            ===================================================== */}

        <section
          id="internships"
          className="section section-soft"
        >
          <div className="container">

            <div className="section-heading">
              <span>INTERNSHIPS</span>

              <h2>
                Learn by working on
                real agricultural problems.
              </h2>

              <p>
                LR AgroSense works with students and early
                professionals who want practical experience
                across agriculture, technology, AI, research
                and business.
              </p>
            </div>

            <div className="about-grid">

              <article className="info-card">

                <Leaf size={25} />

                <h3>
                  Agriculture Research
                </h3>

                <p>
                  Work on crop health, soil, micronutrients,
                  field problems and agricultural research.
                </p>

              </article>

              <article className="info-card">

                <Zap size={25} />

                <h3>
                  Technology
                </h3>

                <p>
                  Explore IoT, sensors, software, AI and
                  agricultural technology development.
                </p>

              </article>

              <article className="info-card">

                <ShieldCheck size={25} />

                <h3>
                  Startup Experience
                </h3>

                <p>
                  Gain practical experience in research,
                  product development, operations and
                  building an early-stage startup.
                </p>

              </article>

            </div>

          </div>
        </section>

        {/* =====================================================
            CONTACT
            ===================================================== */}

        <section
          id="contact"
          className="section"
        >
          <div className="container">

            <div className="contact-box">

              <div>
                <span>GET IN TOUCH</span>

                <h2>
                  Let's build better
                  agriculture.
                </h2>

                <p>
                  Interested in collaborating with
                  LR AgroSense?
                </p>
              </div>

              <a
                href="mailto:contact@lragrosense.in"
                className="primary-button"
              >
                Contact us
                <ArrowRight size={17} />
              </a>

            </div>

          </div>
        </section>

      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="footer">

        <div className="container footer-inner">

          <div>
            <strong>
              LR AgroSense
            </strong>

            <p>
              Smart farming • IoT • AI
            </p>
          </div>

          <div className="footer-right">

            <span>
              Building technology for better agriculture.
            </span>

            <button
              onClick={() => scrollToSection("home")}
            >
              Back to top
              <ChevronDown
                size={14}
                style={{
                  transform: "rotate(180deg)",
                  verticalAlign: "middle",
                }}
              />
            </button>

          </div>

        </div>

      </footer>

    </div>
  );
}
