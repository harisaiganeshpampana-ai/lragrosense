import React, { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
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
} from "lucide-react";

/* =========================================================
   PRODUCTS
   ========================================================= */

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

/* =========================================================
   TECHNOLOGY
   ========================================================= */

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

/* =========================================================
   ROADMAP
   ========================================================= */

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

/* =========================================================
   FAQ
   ========================================================= */

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
      "Open the menu in the top-right corner and select Explore. The Explore page contains LR AgroSense applications and platforms.",
  },
];

/* =========================================================
   APP
   ========================================================= */

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  /* -------------------------------------------------------
     CLOSE MENU
     ------------------------------------------------------- */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* -------------------------------------------------------
     SCROLL TO SECTION
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     FAQ
     ------------------------------------------------------- */

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="site">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="navbar">
        <div className="nav-container">

          {/* -------------------------------------------------
              LOGO
          ------------------------------------------------- */}

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

          {/* -------------------------------------------------
              MAIN WEBSITE NAVIGATION
          ------------------------------------------------- */}

          <nav className="main-navigation">

            <a href="#about">
              About
            </a>

            <a href="#products">
              Products
            </a>

            <a href="#technology">
              Technology
            </a>

            <a href="#research">
              Research
            </a>

            <a href="#roadmap">
              Roadmap
            </a>

            <a href="#internships">
              Internships
            </a>

            <a href="#contact">
              Contact
            </a>

          </nav>

          {/* -------------------------------------------------
              THREE LINE MENU
          ------------------------------------------------- */}

          <button
            className="main-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            type="button"
          >
            <Menu
              size={27}
              strokeWidth={1.8}
            />
          </button>

        </div>
      </header>


      {/* =====================================================
          MENU OVERLAY
      ===================================================== */}

      <div
        className={`menu-overlay ${
          menuOpen ? "menu-overlay-visible" : ""
        }`}
        onClick={closeMenu}
      />


      {/* =====================================================
          RIGHT SIDE MENU
          ONLY EXPLORE
      ===================================================== */}

      <aside
        className={`side-menu ${
          menuOpen ? "side-menu-open" : ""
        }`}
        aria-hidden={!menuOpen}
      >

        {/* -------------------------------------------------
            MENU HEADER
        ------------------------------------------------- */}

        <div className="side-menu-header">

          <span className="side-menu-title">
            Explore
          </span>

          <button
            className="side-menu-close"
            onClick={closeMenu}
            aria-label="Close menu"
            type="button"
          >
            <X size={21} />
          </button>

        </div>


        {/* -------------------------------------------------
            MENU CONTENT
        ------------------------------------------------- */}

        <div className="side-menu-content">

          <div className="side-menu-group">

            <span className="side-menu-label">
              Applications
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

                <strong>
                  Explore LR AgroSense
                </strong>

                <span>
                  Applications & platforms
                </span>

              </div>

              <ChevronRight size={18} />

            </a>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN WEBSITE
      ===================================================== */}

      <main id="top">


        {/* ===================================================
            HERO
        =================================================== */}

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

                <span>
                  Better farming.
                </span>

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
                  type="button"
                >
                  Explore our technology

                  <ArrowRight size={17} />

                </button>


                <button
                  className="secondary-button"
                  onClick={() =>
                    scrollToSection("about")
                  }
                  type="button"
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


        {/* ===================================================
            INTRO
        =================================================== */}

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


        {/* ===================================================
            ABOUT
        =================================================== */}

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

              {/* Mission */}

              <div className="about-card">

                <div className="card-icon">
                  <Target size={21} />
                </div>

                <h3>
                  Our Mission
                </h3>

                <p>
                  Develop affordable smart agricultural
                  technologies that help farmers improve
                  productivity, reduce losses and use
                  resources more efficiently.
                </p>

              </div>


              {/* Vision */}

              <div className="about-card">

                <div className="card-icon">
                  <Lightbulb size={21} />
                </div>

                <h3>
                  Our Vision
                </h3>

                <p>
                  Become a leading AgriTech company by
                  helping farmers adopt smarter, more
                  sustainable and data-driven farming
                  practices.
                </p>

              </div>


              {/* Approach */}

              <div className="about-card">

                <div className="card-icon">
                  <ShieldCheck size={21} />
                </div>

                <h3>
                  Our Approach
                </h3>

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


        {/* ===================================================
            PRODUCTS
        =================================================== */}

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


        {/* ===================================================
            TECHNOLOGY
        =================================================== */}

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

                      <div className="technology-card-icon">
                        <Icon size={21} />
                      </div>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.text}
                      </p>

                    </div>
                  );

                })}

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            RESEARCH
        =================================================== */}

        <section
          id="research"
          className="section research-section"
        >

          <div className="section-container">

            <div className="research-grid">

              <div className="research-content">

                <span className="section-label">
                  Research
                </span>

                <h2>
                  Research before
                  deployment.
                </h2>

                <p>
                  Agricultural technology must work in
                  real field conditions. Our research
                  approach focuses on understanding
                  agricultural problems, developing
                  practical solutions and validating
                  technologies before wider deployment.
                </p>

                <p>
                  We aim to work with farmers,
                  agricultural experts and technology
                  developers to continuously improve
                  our solutions.
                </p>

              </div>


              <div className="research-points">

                <div className="research-point">

                  <div className="research-point-icon">
                    <Leaf size={20} />
                  </div>

                  <div>

                    <h3>
                      Agriculture First
                    </h3>

                    <p>
                      Technology is designed around
                      real agricultural needs.
                    </p>

                  </div>

                </div>


                <div className="research-point">

                  <div className="research-point-icon">
                    <FlaskConical size={20} />
                  </div>

                  <div>

                    <h3>
                      Field Validation
                    </h3>

                    <p>
                      Solutions are tested against
                      real-world farming conditions.
                    </p>

                  </div>

                </div>


                <div className="research-point">

                  <div className="research-point-icon">
                    <Users size={20} />
                  </div>

                  <div>

                    <h3>
                      Collaboration
                    </h3>

                    <p>
                      Farmers and experts are important
                      parts of the development process.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            ROADMAP
        =================================================== */}

        <section
          id="roadmap"
          className="section roadmap-section"
        >

          <div className="section-container">

            <div className="section-heading centered">

              <span className="section-label">
                Roadmap
              </span>

              <h2>
                Building step by step.
              </h2>

              <p>
                LR AgroSense is following a long-term
                development path from practical farm
                monitoring toward connected agricultural
                intelligence.
              </p>

            </div>


            <div className="roadmap-grid">

              {roadmap.map((item) => (

                <div
                  className="roadmap-card"
                  key={item.number}
                >

                  <span className="roadmap-number">
                    {item.number}
                  </span>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* ===================================================
            INTERNSHIPS
        =================================================== */}

        <section
          id="internships"
          className="section internship-section"
        >

          <div className="section-container">

            <div className="internship-grid">

              <div>

                <span className="section-label">
                  Internships
                </span>

                <h2>
                  Learn by building
                  real solutions.
                </h2>

                <p>
                  LR AgroSense provides opportunities
                  for students who want practical
                  experience in agriculture, technology,
                  research, business and product
                  development.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    scrollToSection("contact")
                  }
                  type="button"
                >
                  Get in touch

                  <ArrowRight size={17} />

                </button>

              </div>


              <div className="internship-benefits">

                <div className="internship-benefit">

                  <div className="benefit-icon">
                    <Sprout size={19} />
                  </div>

                  <div>
                    <h3>
                      Agricultural Projects
                    </h3>

                    <p>
                      Work on practical agriculture
                      and AgriTech projects.
                    </p>
                  </div>

                </div>


                <div className="internship-benefit">

                  <div className="benefit-icon">
                    <Cpu size={19} />
                  </div>

                  <div>
                    <h3>
                      Technology Experience
                    </h3>

                    <p>
                      Learn about IoT, software and
                      emerging agricultural technologies.
                    </p>
                  </div>

                </div>


                <div className="internship-benefit">

                  <div className="benefit-icon">
                    <Users size={19} />
                  </div>

                  <div>
                    <h3>
                      Team Collaboration
                    </h3>

                    <p>
                      Work with other students and
                      team members on real projects.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            FAQ
        =================================================== */}

        <section
          id="faq"
          className="section faq-section"
        >

          <div className="section-container">

            <div className="section-heading centered">

              <span className="section-label">
                FAQ
              </span>

              <h2>
                Frequently asked questions.
              </h2>

            </div>


            <div className="faq-list">

              {faqs.map((faq, index) => {

                const isOpen =
                  openFaq === index;

                return (
                  <div
                    className={`faq-item ${
                      isOpen ? "faq-open" : ""
                    }`}
                    key={faq.q}
                  >

                    <button
                      className="faq-question"
                      onClick={() =>
                        toggleFaq(index)
                      }
                      type="button"
                    >

                      <span>
                        {faq.q}
                      </span>

                      <ChevronDown
                        size={19}
                        className={
                          isOpen
                            ? "faq-arrow-open"
                            : ""
                        }
                      />

                    </button>


                    {isOpen && (

                      <div className="faq-answer">

                        <p>
                          {faq.a}
                        </p>

                      </div>

                    )}

                  </div>
                );

              })}

            </div>

          </div>

        </section>


        {/* ===================================================
            CONTACT
        =================================================== */}

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
                  Let's build better
                  agriculture together.
                </h2>

                <p>
                  Whether you are a farmer, student,
                  researcher, agricultural expert or
                  technology enthusiast, we would like
                  to hear from you.
                </p>

              </div>


              <div className="contact-details">

                <a
                  href="mailto:contact@lragrosense.in"
                  className="contact-item"
                >

                  <div className="contact-icon">
                    <Mail size={19} />
                  </div>

                  <div>
                    <span>
                      Email
                    </span>

                    <strong>
                      contact@lragrosense.in
                    </strong>
                  </div>

                </a>


                <div className="contact-item">

                  <div className="contact-icon">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <span>
                      Location
                    </span>

                    <strong>
                      India
                    </strong>
                  </div>

                </div>


                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-item"
                >

                  <div className="contact-icon">
                    <Linkedin size={19} />
                  </div>

                  <div>
                    <span>
                      LinkedIn
                    </span>

                    <strong>
                      LR AgroSense
                    </strong>
                  </div>

                  <ExternalLink
                    size={15}
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

          <div className="footer-top">

            <div className="footer-brand">

              <a
                href="#top"
                className="footer-logo"
              >

                <img
                  src="/company_logo.jpg"
                  alt="LR AgroSense"
                />

                <div>

                  <strong>
                    LR AgroSense
                  </strong>

                  <span>
                    Smart Farming • IoT
                  </span>

                </div>

              </a>

              <p>
                Building practical technology
                for better agriculture.
              </p>

            </div>


            <div className="footer-links">

              <div>

                <h4>
                  Company
                </h4>

                <a href="#about">
                  About
                </a>

                <a href="#products">
                  Products
                </a>

                <a href="#technology">
                  Technology
                </a>

                <a href="#research">
                  Research
                </a>

              </div>


              <div>

                <h4>
                  Explore
                </h4>

                <a href="#roadmap">
                  Roadmap
                </a>

                <a href="#internships">
                  Internships
                </a>

                <a href="/explore.html">
                  Explore LR AgroSense
                </a>

                <a href="#contact">
                  Contact
                </a>

              </div>

            </div>

          </div>


          <div className="footer-bottom">

            <span>
              © {new Date().getFullYear()} LR AgroSense.
              All rights reserved.
            </span>

            <span>
              Agriculture • Technology • Innovation
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;
