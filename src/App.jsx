import React from "react";

const products = [
  {
    title: "Smart Farm Monitor",
    description:
      "An affordable IoT-based monitoring system designed to help farmers understand soil and farm conditions.",
    status: "In Development",
  },
  {
    title: "AgriMind AI",
    description:
      "Our future AI platform for crop-health intelligence, combining farm data, crop information and visual analysis.",
    status: "Research",
  },
  {
    title: "Smart Farm Station",
    description:
      "A future integrated station combining soil, weather and environmental monitoring for smarter farm decisions.",
    status: "Roadmap",
  },
];

const roadmap = [
  {
    phase: "01",
    title: "Research & Foundation",
    text: "Study real farmer problems, validate agricultural needs and build the technical foundation.",
  },
  {
    phase: "02",
    title: "Smart Farm Monitor",
    text: "Develop and field-test an affordable IoT monitoring system for soil and farm conditions.",
  },
  {
    phase: "03",
    title: "AI Crop Intelligence",
    text: "Develop AI-assisted crop health and agricultural decision-support capabilities.",
  },
  {
    phase: "04",
    title: "Integrated Smart Farming",
    text: "Connect soil, weather, crop and farm data into one intelligent agricultural ecosystem.",
  },
];

function App() {
  return (
    <div className="app">
      {/* NAVIGATION */}
      <header className="navbar">
        <a href="#home" className="brand">
          <img
            src="/company_logo.jpg"
            alt="LR AgroSense"
            className="brand-logo"
          />
          <div>
            <div className="brand-name">LR AgroSense</div>
            <div className="brand-tagline">AI • IoT • Smart Farming</div>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#technology">Technology</a>
          <a href="#research">Research</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#internships">Internships</a>
          <a href="#contact">Contact</a>
        </nav>

        <a href="#contact" className="nav-button">
          Connect
        </a>
      </header>

      {/* HERO */}
      <main>
        <section id="home" className="hero">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="eyebrow">BUILDING THE FUTURE OF AGRICULTURE</div>

            <h1>
              Technology that
              <span> understands farming.</span>
            </h1>

            <p>
              LR AgroSense is building affordable AI and IoT solutions to help
              farmers understand their fields, make better decisions and move
              towards smarter, more sustainable agriculture.
            </p>

            <div className="hero-actions">
              <a href="#products" className="primary-button">
                Explore Our Work
              </a>

              <a href="#about" className="secondary-button">
                Learn About LR AgroSense
              </a>
            </div>

            <div className="hero-note">
              Early-stage AgriTech startup • Research • Innovation • Field
              Solutions
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section">
          <div className="section-heading">
            <span>01 — ABOUT</span>
            <h2>Building practical technology for real agricultural problems.</h2>
          </div>

          <div className="about-grid">
            <div>
              <p className="large-text">
                LR AgroSense is an early-stage AgriTech startup dedicated to
                developing innovative, affordable and technology-driven
                solutions for agriculture.
              </p>

              <p>
                Our approach starts with understanding farmers and the problems
                they face in the field. We then combine agriculture,
                electronics, IoT, software and artificial intelligence to
                develop practical solutions.
              </p>

              <p>
                Our long-term goal is to create an integrated agricultural
                technology ecosystem that helps farmers improve productivity,
                use resources efficiently and reduce avoidable losses.
              </p>
            </div>

            <div className="info-card">
              <div className="card-number">01</div>
              <h3>Our Vision</h3>
              <p>
                To become a leading AgriTech company by helping farmers reduce
                losses, promoting sustainable agriculture and enabling
                healthier food.
              </p>

              <div className="card-divider"></div>

              <div className="card-number">02</div>
              <h3>Our Mission</h3>
              <p>
                Develop affordable smart agricultural technologies that solve
                real-world farming problems.
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="section dark-section">
          <div className="section-heading">
            <span>02 — PRODUCTS & PROJECTS</span>
            <h2>From sensing the field to understanding the field.</h2>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.title}>
                <div className="product-status">{product.status}</div>

                <h3>{product.title}</h3>

                <p>{product.description}</p>

                <a href="#contact">Learn More →</a>
              </article>
            ))}
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section id="technology" className="section">
          <div className="section-heading">
            <span>03 — TECHNOLOGY</span>
            <h2>A connected approach to smarter agriculture.</h2>
          </div>

          <div className="technology-grid">
            <div className="technology-card">
              <div className="tech-number">01</div>
              <h3>IoT & Sensors</h3>
              <p>
                We are exploring sensor-based systems for collecting useful
                field and environmental information.
              </p>
            </div>

            <div className="technology-card">
              <div className="tech-number">02</div>
              <h3>Data & Analytics</h3>
              <p>
                Agricultural measurements can be converted into useful
                information for understanding changing farm conditions.
              </p>
            </div>

            <div className="technology-card">
              <div className="tech-number">03</div>
              <h3>Artificial Intelligence</h3>
              <p>
                AI will be used to support agricultural analysis, crop-health
                intelligence and decision-making.
              </p>
            </div>

            <div className="technology-card">
              <div className="tech-number">04</div>
              <h3>Farmer-Focused Design</h3>
              <p>
                Technology should remain affordable, understandable and useful
                for farmers in real field conditions.
              </p>
            </div>
          </div>
        </section>

        {/* RESEARCH */}
        <section id="research" className="section research-section">
          <div className="research-content">
            <div className="section-heading">
              <span>04 — RESEARCH</span>
              <h2>Research before claims. Validation before scale.</h2>
            </div>

            <p>
              Agriculture is complex. Soil conditions, crop varieties, weather,
              management practices and disease symptoms can interact in many
              ways.
            </p>

            <p>
              LR AgroSense is therefore taking a research-first approach. Our
              future crop-health systems will combine multiple sources of
              information instead of relying on a single measurement.
            </p>

            <div className="research-points">
              <div>✓ Soil and environmental data</div>
              <div>✓ Crop and field information</div>
              <div>✓ Plant images and visual symptoms</div>
              <div>✓ Expert and laboratory validation</div>
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section id="roadmap" className="section">
          <div className="section-heading">
            <span>05 — ROADMAP</span>
            <h2>Our journey from research to real-world impact.</h2>
          </div>

          <div className="roadmap">
            {roadmap.map((item) => (
              <div className="roadmap-item" key={item.phase}>
                <div className="roadmap-phase">{item.phase}</div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNSHIPS */}
        <section id="internships" className="section dark-section">
          <div className="internship-box">
            <div>
              <span>06 — INTERNSHIPS</span>

              <h2>Build with us. Learn by solving real problems.</h2>

              <p>
                LR AgroSense offers project-based opportunities for students
                and researchers interested in agriculture, IoT, AI, software,
                business and related fields.
              </p>
            </div>

            <a href="#contact" className="primary-button light-button">
              Internship Enquiry
            </a>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section contact-section">
          <div className="section-heading">
            <span>07 — CONTACT</span>
            <h2>Let's build the future of agriculture.</h2>
          </div>

          <div className="contact-grid">
            <div>
              <p className="large-text">
                Interested in our work, research, internships or future
                collaboration?
              </p>

              <p>
                We are open to connecting with farmers, students, researchers,
                agricultural professionals, technology experts and potential
                partners.
              </p>
            </div>

            <div className="contact-card">
              <h3>LR AgroSense</h3>

              <p>AI • IoT • Smart Farming</p>

              <a href="mailto:contact@lragrosense.in">
                contact@lragrosense.in
              </a>

              <a
                href="https://lragrosense.in"
                target="_blank"
                rel="noreferrer"
              >
                lragrosense.in
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <strong>LR AgroSense</strong>
          <p>Building technology for smarter and more sustainable agriculture.</p>
        </div>

        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} LR AgroSense. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
