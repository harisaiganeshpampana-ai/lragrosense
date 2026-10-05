import React, { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Sprout,
  Cpu,
  Cloud,
  ShieldCheck,
  Leaf,
  Smartphone,
  Satellite,
  FlaskConical,
  Users,
  Target,
  Lightbulb,
  Mail,
  MapPin,
  Linkedin,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const products = [
  {
    icon: Sprout,
    title: "Smart Farm Monitor",
    text:
      "Affordable IoT-based monitoring for soil and farm conditions, designed to help farmers make better irrigation and crop-management decisions.",
    status: "In Development",
  },
  {
    icon: Satellite,
    title: "Smart Farm Station",
    text:
      "A future integrated station combining soil, weather and environmental data to provide a broader picture of field conditions.",
    status: "Research",
  },
  {
    icon: FlaskConical,
    title: "Agricultural Intelligence",
    text:
      "Research into intelligent agricultural systems that combine field data, crop information and agricultural knowledge.",
    status: "Research",
  },
];

const technology = [
  {
    icon: Cpu,
    title: "IoT Sensors",
    text:
      "Connected sensors for collecting useful soil and environmental measurements from the field.",
  },
  {
    icon: Cloud,
    title: "Cloud Intelligence",
    text:
      "Farm data can be securely transferred and organized for monitoring, analysis and future intelligent systems.",
  },
  {
    icon: Smartphone,
    title: "Farmer-Friendly Apps",
    text:
      "Simple interfaces designed around the way farmers need to receive and understand information.",
  },
  {
    icon: FlaskConical,
    title: "Research & Validation",
    text:
      "New agricultural technologies are developed through testing, field observation and validation.",
  },
];

const roadmap = [
  {
    number: "01",
    title: "Smart Farm Monitor",
    text:
      "Build and validate an affordable IoT monitoring system for important farm parameters.",
  },
  {
    number: "02",
    title: "Field Testing",
    text:
      "Work with farmers and agricultural experts to test real-world conditions and improve the system.",
  },
  {
    number: "03",
    title: "Agricultural Intelligence",
    text:
      "Develop intelligent agricultural systems using crop information, farmer questions and agricultural data.",
  },
  {
    number: "04",
    title: "Smart Farm Intelligence",
    text:
      "Combine soil, weather, crop and environmental information into one intelligent farming ecosystem.",
  },
];

const faqs = [
  {
    q: "What is LR AgroSense?",
    a:
      "LR AgroSense is an early-stage AgriTech startup focused on developing affordable technologies using IoT, agricultural data and intelligent systems.",
  },
  {
    q: "What technologies is LR AgroSense developing?",
    a:
      "Our roadmap includes smart farm monitoring, IoT sensing, environmental monitoring and future intelligent agricultural systems.",
  },
  {
    q: "Is LR AgroSense currently developing hardware?",
    a:
      "Yes. Smart agricultural monitoring hardware is part of our development roadmap, with research and field validation planned before wider deployment.",
  },
  {
    q: "Where can I explore LR AgroSense applications?",
    a:
      "Open the menu and select Explore. The Explore page will contain LR AgroSense applications and platforms as they become available.",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToSection = (id) => {
    closeMenu();

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="site">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">

        <div className="nav-container">

          {/* COMPANY LOGO */}

          <a
            href="#top"
            className="brand"
            onClick={closeMenu}
          >
            <img
              src="/company_logo.jpg"
              alt="LR AgroSense"
              className="brand-logo"
            />

            <div className="brand-text">
              <strong>LR AgroSense</strong>
              <span>Smart Farming • IoT</span>
            </div>
          </a>

          {/* THREE LINE MENU */}

          <button
            className="main-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={27} strokeWidth={1.8} />
          </button>

        </div>

      </header>

      {/* =====================================================
          SIDE MENU OVERLAY
      ===================================================== */}

      <div
        className={`menu-overlay ${
          menuOpen ? "menu-overlay-visible" : ""
        }`}
        onClick={closeMenu}
      />

      {/* =====================================================
          SIDE MENU
      ===================================================== */}

      <aside
        className={`side-menu ${
          menuOpen ? "side-menu-open" : ""
        }`}
        aria-hidden={!menuOpen}
      >

        <div className="side-menu-header">

          <div className="side-menu-brand">

            <img
              src="/company_logo.jpg"
              alt="LR AgroSense"
            />

            <div>
              <strong>LR AgroSense</strong>
              <span>Smart Farming • IoT</span>
            </div>

          </div>

          <button
            className="side-menu-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        <div className="side-menu-content">

          {/* COMPANY */}

          <div className="side-menu-group">

            <span className="side-menu-label">
              Company
            </span>

            <button
              className="side-menu-link"
              onClick={() =>
                scrollToSection("about")
              }
            >
              <span>About</span>
              <ChevronRight size={17} />
            </button>

            <button
              className="side-menu-link"
              onClick={() =>
                scrollToSection("products")
              }
            >
              <span>Products</span>
              <ChevronRight size={17} />
            </button>

            <button
              className="side-menu-link"
              onClick={() =>
                scrollToSection("technology")
              }
            >
              <span>Technology</span>
              <ChevronRight size={17} />
            </button>

            <button
              className="side-menu-link"
              onClick={() =>
                scrollToSection("research")
              }
            >
              <span>Research</span>
              <ChevronRight size={17} />
            </button>

            <button
              className="side-menu-link"
              onClick={() =>
                scrollToSection("roadmap")
              }
            >
              <span>Roadmap</span>
              <ChevronRight size={17} />
            </button>

            <button
              className="side-menu-link"
              onClick={() =>
                scrollToSection("internships")
              }
            >
              <span>Internships</span>
              <ChevronRight size={17} />
            </button>

          </div>

          {/* EXPLORE */}

          <div className="side-menu-group">

            <span className="side-menu-label">
              Explore
            </span>

            <a
              href="/explore.html"
              className="side-menu-explore"
              onClick={closeMenu}
            >

              <div className="explore-icon">
                ✦
              </div>

              <div className="explore-info">
                <strong>Explore LR AgroSense</strong>
                <span>
                  Applications & platforms
                </span>
              </div>

              <ChevronRight size={18} />

            </a>

          </div>

          {/* CONTACT */}

          <div className="side-menu-group">

            <span className="side-menu-label">
              Support
            </span>

            <button
              className="side-menu-link"
              onClick={() =>
                scrollToSection("contact")
              }
            >
              <span>Contact</span>
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

        <div className="side-menu-footer">

          <span>
            LR AgroSense
          </span>

          <small>
            Building technology for better agriculture.
          </small>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main id="top">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="hero">

          <div className="hero-overlay" />

          <div className="hero-container">

            <div className="hero-content">

              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Building the future of agriculture
              </div>

              <h1>
                Smarter technology.
                <br />
                <span>Better farming.</span>
              </h1>

              <p>
                LR AgroSense is building affordable
                agricultural technologies that combine
                IoT, field data and intelligent systems
                to help farmers make better decisions.
              </p>

              <div className="hero-actions">

                <button
                  className="primary-button"
                  onClick={() =>
                    scrollToSection("products")
                  }
                >
                  Explore our technology
                  <ArrowRight size={17} />
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    scrollToSection("about")
                  }
                >
                  About LR AgroSense
                  <ArrowRight size={17} />
                </button>

              </div>

              <div className="hero-note">
                Designed for practical,
                affordable and sustainable farming.
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="intro-strip">

          <div className="section-container">

            <div className="intro-grid">

              <div>

                <span className="section-label">
                  Our focus
                </span>

                <h2>
                  Technology should solve
                  real agricultural problems.
                </h2>

              </div>

              <p>
                Farmers face challenges involving
                water, soil health, crop diseases,
                pests, weather and access to useful
                information. LR AgroSense is working
                toward practical technology that can
                turn farm data into understandable
                decisions.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            ABOUT
        ===================================================== */}

        <section
          id="about"
          className="section about-section"
        >

          <div className="section-container">

            <div className="section-heading">

              <span className="section-label">
                About LR AgroSense
              </span>

              <h2>
                Building technology
                around farmers.
              </h2>

              <p>
                LR AgroSense is an early-stage
                AgriTech startup focused on developing
                affordable, technology-driven solutions
                for agriculture.
              </p>

            </div>

            <div className="about-grid">

              <div className="about-card">

                <div className="card-icon">
                  <Target size={21} />
                </div>

                <h3>Our Mission</h3>

                <p>
                  Develop affordable smart agricultural
                  technologies that help farmers improve
                  productivity, reduce losses and use
                  resources more efficiently.
                </p>

              </div>

              <div className="about-card">

                <div className="card-icon">
                  <Lightbulb size={21} />
                </div>

                <h3>Our Vision</h3>

                <p>
                  Become a leading AgriTech company by
                  helping farmers adopt smarter, more
                  sustainable and data-driven farming
                  practices.
                </p>

              </div>

              <div className="about-card">

                <div className="card-icon">
                  <ShieldCheck size={21} />
                </div>

                <h3>Our Approach</h3>

                <p>
                  We focus on research, field validation
                  and practical engineering instead of
                  making technology claims before they
                  are properly tested.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <section
          id="products"
          className="section products-section"
        >

          <div className="section-container">

            <div className="section-heading centered">

              <span className="section-label">
                Products & Platforms
              </span>

              <h2>
                From sensors to
                agricultural intelligence.
              </h2>

              <p>
                Our product roadmap connects field
                sensing, agricultural data and
                intelligent systems into a long-term
                farming platform.
              </p>

            </div>

            <div className="products-grid">

              {products.map((product) => {

                const Icon = product.icon;

                return (
                  <article
                    className="product-card"
                    key={product.title}
                  >

                    <div className="product-top">

                      <div className="product-icon">
                        <Icon size={22} />
                      </div>

                      <span className="product-status">
                        {product.status}
                      </span>

                    </div>

                    <h3>
                      {product.title}
                    </h3>

                    <p>
                      {product.text}
                    </p>

                  </article>
                );

              })}

            </div>

          </div>

        </section>

        {/* =====================================================
            TECHNOLOGY
        ===================================================== */}

        <section
          id="technology"
          className="section technology-section"
        >

          <div className="section-container">

            <div className="technology-grid">

              <div className="technology-intro">

                <span className="section-label">
                  Technology
                </span>

                <h2>
                  Connecting the field
                  to useful intelligence.
                </h2>

                <p>
                  Our long-term technology architecture
                  combines sensors, connectivity, cloud
                  systems, agricultural knowledge and
                  intelligent software.
                </p>

                <div className="technology-flow">

                  <div>
                    <Sprout size={18} />
                    Field
                  </div>

                  <ArrowRight size={16} />

                  <div>
                    <Cpu size={18} />
                    Sensors
                  </div>

                  <ArrowRight size={16} />

                  <div>
                    <Cloud size={18} />
                    Data
                  </div>

                  <ArrowRight size={16} />

                  <div>
                    <FlaskConical size={18} />
                    Intelligence
                  </div>

                </div>

              </div>

              <div className="technology-cards">

                {technology.map((item) => {

                  const Icon = item.icon;

                  return (
                    <div
                      className="technology-card"
                      key={item.title}
                    >

                      <div className="card-icon">
                        <Icon size={19} />
                      </div>

                      <div>

                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          {item.text}
                        </p>

                      </div>

                    </div>
                  );

                })}

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RESEARCH
        ===================================================== */}

        <section
          id="research"
          className="section research-section"
        >

          <div className="section-container">

            <div className="research-grid">

              <div>

                <span className="section-label">
                  Research & Development
                </span>

                <h2>
                  We are starting with
                  the problem, not the product.
                </h2>

                <p>
                  LR AgroSense is researching real
                  farmer problems before committing
                  to large-scale hardware and software
                  development.
                </p>

              </div>

              <div className="research-points">

                <div className="research-point">

                  <span>01</span>

                  <div>
                    <h3>
                      Understand the problem
                    </h3>

                    <p>
                      Talk with farmers and
                      agricultural professionals
                      to understand recurring
                      challenges.
                    </p>
                  </div>

                </div>

                <div className="research-point">

                  <span>02</span>

                  <div>
                    <h3>
                      Collect real evidence
                    </h3>

                    <p>
                      Compare field observations
                      with soil, crop, weather
                      and expert information.
                    </p>
                  </div>

                </div>

                <div className="research-point">

                  <span>03</span>

                  <div>
                    <h3>
                      Build and test
                    </h3>

                    <p>
                      Develop prototypes and
                      evaluate their performance
                      under real agricultural
                      conditions.
                    </p>
                  </div>

                </div>

                <div className="research-point">

                  <span>04</span>

                  <div>
                    <h3>
                      Improve continuously
                    </h3>

                    <p>
                      Use field feedback to improve
                      accuracy, affordability and
                      usability.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            ROADMAP
        ===================================================== */}

        <section
          id="roadmap"
          className="section roadmap-section"
        >

          <div className="section-container">

            <div className="section-heading">

              <span className="section-label">
                Roadmap
              </span>

              <h2>
                A long-term vision
                for smarter agriculture.
              </h2>

              <p>
                Our roadmap will evolve through
                research, prototypes, farmer feedback
                and validated technology.
              </p>

            </div>

            <div className="roadmap">

              {roadmap.map((item, index) => (

                <div
                  className="roadmap-item"
                  key={item.number}
                >

                  <div className="roadmap-number">
                    {item.number}
                  </div>

                  <div className="roadmap-content">

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.text}
                    </p>

                  </div>

                  {index < roadmap.length - 1 && (
                    <div className="roadmap-line" />
                  )}

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            INTERNSHIPS
        ===================================================== */}

        <section
          id="internships"
          className="section internship-section"
        >

          <div className="section-container">

            <div className="internship-card">

              <div className="internship-content">

                <span className="section-label">
                  Join LR AgroSense
                </span>

                <h2>
                  Work on real
                  agricultural problems.
                </h2>

                <p>
                  We welcome students and motivated
                  contributors who want practical
                  experience in AgriTech, agriculture,
                  IoT, AI, research, software and
                  business development.
                </p>

                <div className="internship-points">

                  <span>
                    <Users size={16} />
                    Student-friendly
                  </span>

                  <span>
                    <Leaf size={16} />
                    Agriculture focused
                  </span>

                  <span>
                    <Target size={16} />
                    Real project work
                  </span>

                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    scrollToSection("contact")
                  }
                >
                  Get in touch
                  <ArrowRight size={17} />
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}

        <section className="section faq-section">

          <div className="section-container">

            <div className="section-heading centered">

              <span className="section-label">
                Frequently Asked
              </span>

              <h2>
                About LR AgroSense
              </h2>

            </div>

            <div className="faq-list">

              {faqs.map((item, index) => (

                <div
                  className={`faq-item ${
                    openFaq === index
                      ? "faq-open"
                      : ""
                  }`}
                  key={item.q}
                >

                  <button
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index
                          ? null
                          : index
                      )
                    }
                  >

                    <span>
                      {item.q}
                    </span>

                    <ChevronDown size={18} />

                  </button>

                  {openFaq === index && (

                    <div className="faq-answer">

                      <p>
                        {item.a}
                      </p>

                    </div>

                  )}

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            CONTACT
        ===================================================== */}

        <section
          id="contact"
          className="section contact-section"
        >

          <div className="section-container">

            <div className="contact-grid">

              <div className="contact-intro">

                <span className="section-label">
                  Contact
                </span>

                <h2>
                  Let's build the future
                  of agriculture.
                </h2>

                <p>
                  Interested in collaborating,
                  researching, joining the team or
                  discussing an agricultural technology
                  idea?
                </p>

              </div>

              <div className="contact-details">

                <a
                  href="mailto:contact@lragrosense.in"
                  className="contact-item"
                >

                  <div className="contact-icon">
                    <Mail size={18} />
                  </div>

                  <div>
                    <span>Email</span>

                    <strong>
                      contact@lragrosense.in
                    </strong>
                  </div>

                </a>

                <div className="contact-item">

                  <div className="contact-icon">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <span>Focus</span>

                    <strong>
                      Agriculture • India
                    </strong>
                  </div>

                </div>

                <a
                  href="https://www.linkedin.com/company/lr-agrosense/"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-item"
                >

                  <div className="contact-icon">
                    <Linkedin size={18} />
                  </div>

                  <div>
                    <span>LinkedIn</span>

                    <strong>
                      LR AgroSense
                    </strong>
                  </div>

                  <ExternalLink
                    size={14}
                    className="contact-external"
                  />

                </a>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="section-container">

          <div className="footer-grid">

            <div className="footer-brand">

              <img
                src="/company_logo.jpg"
                alt="LR AgroSense"
              />

              <p>
                Affordable technology for
                smarter and more sustainable
                agriculture.
              </p>

            </div>

            <div className="footer-column">

              <h4>Company</h4>

              <button
                onClick={() =>
                  scrollToSection("about")
                }
              >
                About
              </button>

              <button
                onClick={() =>
                  scrollToSection("products")
                }
              >
                Products
              </button>

              <button
                onClick={() =>
                  scrollToSection("research")
                }
              >
                Research
              </button>

              <button
                onClick={() =>
                  scrollToSection("roadmap")
                }
              >
                Roadmap
              </button>

            </div>

            <div className="footer-column">

              <h4>Explore</h4>

              <a href="/explore.html">
                Explore LR AgroSense
              </a>

              <span className="footer-coming-soon">
                More applications coming soon
              </span>

            </div>

            <div className="footer-column">

              <h4>Connect</h4>

              <button
                onClick={() =>
                  scrollToSection("contact")
                }
              >
                Contact
              </button>

              <a
                href="https://www.linkedin.com/company/lr-agrosense/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

            </div>

          </div>

          <div className="footer-bottom">

            <span>
              © {new Date().getFullYear()} LR AgroSense.
              All rights reserved.
            </span>

            <span>
              Built for better agriculture.
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;
