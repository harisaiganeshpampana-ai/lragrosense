import React, { useState } from "react";
import {
  ArrowRight,
  Menu,
  X,
  Sprout,
  Cpu,
  Cloud,
  ShieldCheck,
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
  ChevronDown,
  Droplets,
  Leaf,
  Database,
  Wifi,
} from "lucide-react";

const products = [
  {
    icon: Sprout,
    title: "Smart Farm Monitor",
    text: "Affordable IoT-based monitoring for important soil and farm conditions, designed to help farmers make better irrigation and crop-management decisions.",
    status: "In Development",
  },
  {
    icon: Satellite,
    title: "Smart Farm Station",
    text: "A future integrated station combining soil, weather and environmental information to provide a broader picture of field conditions.",
    status: "Research",
  },
  {
    icon: FlaskConical,
    title: "Agricultural Research",
    text: "Research-driven agricultural technologies developed through field observation, testing, expert knowledge and practical validation.",
    status: "Research",
  },
];

const technology = [
  {
    icon: Cpu,
    title: "IoT Sensors",
    text: "Connected sensors designed to collect useful soil and environmental measurements directly from the field.",
  },
  {
    icon: Wifi,
    title: "Connectivity",
    text: "Communication technologies can connect field devices with digital systems for monitoring and data transfer.",
  },
  {
    icon: Cloud,
    title: "Cloud Data",
    text: "Farm information can be organized securely to support monitoring, analysis and future intelligent systems.",
  },
  {
    icon: Smartphone,
    title: "Farmer-Friendly Apps",
    text: "Simple interfaces designed around the way farmers need to receive and understand information.",
  },
];

const roadmap = [
  {
    number: "01",
    title: "Smart Farm Monitor",
    text: "Build and validate an affordable IoT monitoring system for important farm parameters.",
  },
  {
    number: "02",
    title: "Field Validation",
    text: "Work with farmers and agricultural experts to test technology under real agricultural conditions.",
  },
  {
    number: "03",
    title: "Agricultural Intelligence",
    text: "Develop intelligent systems that can combine farm information with agricultural knowledge.",
  },
  {
    number: "04",
    title: "Smart Farming Ecosystem",
    text: "Connect soil, crop, weather and environmental information into a broader farming technology platform.",
  },
];

const faqs = [
  {
    question: "What is LR AgroSense?",
    answer:
      "LR AgroSense is an early-stage AgriTech startup focused on developing affordable, practical and technology-driven solutions for agriculture.",
  },
  {
    question: "What is the first product?",
    answer:
      "The first major product is the LR AgroSense Smart Farm Monitor, an IoT-based system being developed to monitor useful farm parameters.",
  },
  {
    question: "Who is LR AgroSense building for?",
    answer:
      "The long-term focus is on practical agricultural technology that can benefit farmers, agricultural professionals and other people working with farm data.",
  },
  {
    question: "Can students join LR AgroSense?",
    answer:
      "Yes. LR AgroSense can provide opportunities for students who want practical experience in agriculture, technology, research, content, business and related areas.",
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

      {/* =========================
          HEADER
      ========================== */}

      <header className="navbar">
        <div className="nav-container">

          <a href="#top" className="brand" onClick={closeMenu}>
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

          <nav className="main-navigation">
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

            <button onClick={() => scrollToSection("contact")}>
              Contact
            </button>
          </nav>

          <button
            className="main-menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={25} /> : <Menu size={27} />}
          </button>

        </div>
      </header>

      {/* =========================
          OVERLAY
      ========================== */}

      <div
        className={`menu-overlay ${menuOpen ? "menu-overlay-visible" : ""}`}
        onClick={closeMenu}
      />

      {/* =========================
          EXPLORE SIDEBAR
      ========================== */}

      <aside className={`side-menu ${menuOpen ? "side-menu-open" : ""}`}>

        <div className="side-menu-header">
          <div>
            <span className="side-menu-small">
              LR AgroSense
            </span>

            <h2>Explore</h2>
          </div>

          <button
            className="side-menu-close"
            onClick={closeMenu}
            aria-label="Close Explore menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="side-menu-content">

          <span className="side-menu-label">
            APPLICATIONS
          </span>

          <a
            href="/explore.html"
            className="explore-sidebar-card"
            onClick={closeMenu}
          >
            <div className="explore-sidebar-icon">
              <Sprout size={22} />
            </div>

            <div className="explore-sidebar-text">
              <strong>Explore LR AgroSense</strong>

              <span>
                Discover our applications and
                agricultural technology platforms.
              </span>
            </div>

            <ArrowRight size={18} />
          </a>

          <div className="side-menu-note">
            More LR AgroSense applications will be
            added here as they become available.
          </div>

        </div>

      </aside>

      {/* =========================
          MAIN
      ========================== */}

      <main id="top">

        {/* HERO */}

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
                to help solve real farming challenges.
              </p>

              <div className="hero-actions">

                <button
                  className="primary-button"
                  onClick={() => scrollToSection("products")}
                >
                  Explore our technology
                  <ArrowRight size={17} />
                </button>

                <button
                  className="secondary-button"
                  onClick={() => scrollToSection("about")}
                >
                  Learn about us
                </button>

              </div>

              <div className="hero-note">
                Practical • Affordable • Sustainable
              </div>

            </div>

          </div>

        </section>

        {/* INTRO */}

        <section className="intro-strip">

          <div className="section-container">

            <div className="intro-grid">

              <div>
                <span className="section-label">
                  OUR FOCUS
                </span>

                <h2>
                  Technology should solve
                  real agricultural problems.
                </h2>
              </div>

              <p>
                Farmers face challenges involving water,
                soil health, crop diseases, pests, weather
                and access to useful information. LR AgroSense
                is working toward practical technology that
                can turn farm data into understandable
                information and better decisions.
              </p>

            </div>

          </div>

        </section>

        {/* ABOUT */}

        <section id="about" className="section about-section">

          <div className="section-container">

            <div className="section-heading">

              <span className="section-label">
                ABOUT LR AGROSENSE
              </span>

              <h2>
                Building technology
                around farmers.
              </h2>

              <p>
                LR AgroSense is an early-stage AgriTech
                startup focused on developing affordable,
                technology-driven solutions for agriculture.
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

        {/* PRODUCTS */}

        <section id="products" className="section products-section">

          <div className="section-container">

            <div className="section-heading centered">

              <span className="section-label">
                PRODUCTS & PLATFORMS
              </span>

              <h2>
                From sensors to
                agricultural intelligence.
              </h2>

              <p>
                Our roadmap connects field sensing,
                agricultural data and intelligent
                technology into a long-term farming
                ecosystem.
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

                    <h3>{product.title}</h3>

                    <p>{product.text}</p>

                    <div className="product-bottom">
                      <span>LR AgroSense</span>
                      <ArrowRight size={16} />
                    </div>

                  </article>
                );
              })}

            </div>

          </div>

        </section>

        {/* TECHNOLOGY */}

        <section id="technology" className="section technology-section">

          <div className="section-container">

            <div className="technology-grid">

              <div className="technology-intro">

                <span className="section-label">
                  TECHNOLOGY
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
                    <Database size={18} />
                    Data
                  </div>

                  <ArrowRight size={16} />

                  <div>
                    <Cloud size={18} />
                    Cloud
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
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

        </section>

        {/* RESEARCH */}

        <section id="research" className="section research-section">

          <div className="section-container">

            <div className="research-grid">

              <div>

                <span className="section-label">
                  RESEARCH & DEVELOPMENT
                </span>

                <h2>
                  We start with the problem,
                  not the product.
                </h2>

                <p>
                  LR AgroSense is researching real farmer
                  problems before committing to large-scale
                  hardware and software development.
                </p>

              </div>

              <div className="research-points">

                <div className="research-point">
                  <span>01</span>

                  <div>
                    <h3>Understand the problem</h3>

                    <p>
                      Talk with farmers and agricultural
                      professionals to understand recurring
                      challenges.
                    </p>
                  </div>
                </div>

                <div className="research-point">
                  <span>02</span>

                  <div>
                    <h3>Collect real evidence</h3>

                    <p>
                      Compare field observations with
                      soil, crop, weather and expert
                      information.
                    </p>
                  </div>
                </div>

                <div className="research-point">
                  <span>03</span>

                  <div>
                    <h3>Build and test</h3>

                    <p>
                      Develop prototypes and evaluate
                      their performance under real
                      agricultural conditions.
                    </p>
                  </div>
                </div>

                <div className="research-point">
                  <span>04</span>

                  <div>
                    <h3>Improve continuously</h3>

                    <p>
                      Use field feedback to improve
                      accuracy, affordability and usability.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ROADMAP */}

        <section id="roadmap" className="section roadmap-section">

          <div className="section-container">

            <div className="section-heading centered">

              <span className="section-label">
                ROADMAP
              </span>

              <h2>
                Building step by step.
              </h2>

              <p>
                LR AgroSense is taking a long-term approach
                to building agricultural technology.
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

                  <div className="roadmap-line">
                    {index !== roadmap.length - 1 && (
                      <span />
                    )}
                  </div>

                  <div className="roadmap-content">

                    <h3>{item.title}</h3>

                    <p>{item.text}</p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* INTERNSHIPS */}

        <section id="internships" className="section internship-section">

          <div className="section-container">

            <div className="internship-card">

              <div className="internship-icon">
                <Users size={27} />
              </div>

              <div className="internship-content">

                <span className="section-label">
                  INTERNSHIPS
                </span>

                <h2>
                  Learn. Build. Contribute.
                </h2>

                <p>
                  We welcome students who want practical
                  experience while working on agriculture,
                  technology, research, business, content
                  and other startup activities.
                </p>

                <div className="internship-points">

                  <span>
                    <ShieldCheck size={15} />
                    Practical experience
                  </span>

                  <span>
                    <Leaf size={15} />
                    Agriculture-focused work
                  </span>

                  <span>
                    <Users size={15} />
                    Remote opportunities
                  </span>

                </div>

                <a
                  href="mailto:info@lragrosense.in?subject=Internship%20Interest%20-%20LR%20AgroSense"
                  className="primary-button"
                >
                  Contact about internships
                  <ArrowRight size={17} />
                </a>

              </div>

            </div>

          </div>

        </section>

        {/* FAQ */}

        <section className="section faq-section">

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

                const isOpen = openFaq === index;

                return (
                  <div
                    className={`faq-item ${
                      isOpen ? "faq-open" : ""
                    }`}
                    key={faq.question}
                  >

                    <button
                      className="faq-question"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                    >

                      <span>{faq.question}</span>

                      <ChevronDown
                        size={19}
                        className="faq-chevron"
                      />

                    </button>

                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

        {/* CONTACT */}

        <section id="contact" className="section contact-section">

          <div className="section-container">

            <div className="contact-grid">

              <div>

                <span className="section-label">
                  CONTACT
                </span>

                <h2>
                  Let's build the future
                  of agriculture.
                </h2>

                <p>
                  Interested in LR AgroSense, our technology,
                  research or collaboration opportunities?
                  Get in touch with us.
                </p>

              </div>

              <div className="contact-details">

                <a
                  href="mailto:info@lragrosense.in"
                  className="contact-item"
                >
                  <Mail size={19} />
                  <span>
                    info@lragrosense.in
                  </span>
                </a>

                <div className="contact-item">
                  <MapPin size={19} />
                  <span>
                    India
                  </span>
                </div>

                <a
                  href="https://www.linkedin.com/company/lr-agrosense/"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-item"
                >
                  <Linkedin size={19} />
                  <span>
                    LR AgroSense on LinkedIn
                  </span>
                  <ExternalLink size={14} />
                </a>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="footer">

        <div className="section-container">

          <div className="footer-top">

            <a href="#top" className="footer-brand">

              <img
                src="/company_logo.jpg"
                alt="LR AgroSense"
              />

              <div>
                <strong>LR AgroSense</strong>
                <span>Smart Farming • IoT</span>
              </div>

            </a>

            <p>
              Affordable technology for smarter,
              more sustainable agriculture.
            </p>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 LR AgroSense. All rights reserved.
            </span>

            <span>
              Built for agriculture.
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;
