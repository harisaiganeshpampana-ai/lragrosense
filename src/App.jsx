import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Droplets,
  FlaskConical,
  Thermometer,
  Wind,
  Leaf,
  Radio,
  Cloud,
  Smartphone,
  Sprout,
  Satellite,
  Languages,
  Search,
  ClipboardCheck,
  Wrench,
  RefreshCw,
  Mail,
  Linkedin,
  MapPin,
  ChevronDown,
  Handshake,
  Building2,
  Tractor,
  CircleDollarSign,
  ShieldAlert,
} from "lucide-react";
import Internships from "./Internships";
import { CONTACT_EMAIL } from "./config";

/* -----------------------------------------------------------
   CONTENT — edit the text here to update the website
----------------------------------------------------------- */

const EMAIL = CONTACT_EMAIL;
const LINKEDIN = "https://www.linkedin.com/company/lr-agrosense/";

const navLinks = [
  { id: "product", label: "Product" },
  { id: "how", label: "How it works" },
  { id: "roadmap", label: "Roadmap" },
  { id: "about", label: "About" },
  { id: "careers", label: "Careers" },
];

const measures = [
  { icon: Droplets, label: "Soil moisture" },
  { icon: FlaskConical, label: "Soil pH" },
  { icon: Leaf, label: "NPK nutrients" },
  { icon: Thermometer, label: "Temperature" },
  { icon: Wind, label: "Humidity" },
];

const problems = [
  {
    icon: Droplets,
    title: "Water is used by guesswork",
    text: "Without knowing what the soil actually holds, fields get watered too much or too little, wasting water and power while stressing the crop.",
  },
  {
    icon: CircleDollarSign,
    title: "Fertilizer costs keep rising",
    text: "Nutrients are often applied by habit, not by need. That costs money, harms soil health and doesn't always improve yield.",
  },
  {
    icon: ShieldAlert,
    title: "Problems are spotted too late",
    text: "By the time stress shows on the plant, the damage is done. Early signals from the soil and weather could warn farmers sooner.",
  },
];

const steps = [
  {
    icon: Radio,
    title: "Sense",
    text: "A low-cost sensor unit in the field measures soil and weather conditions through the day.",
  },
  {
    icon: Cloud,
    title: "Send",
    text: "Readings travel over the network to a secure cloud, building a history of the field.",
  },
  {
    icon: Sprout,
    title: "Understand",
    text: "Data is combined with agricultural knowledge to turn raw numbers into clear advice.",
  },
  {
    icon: Smartphone,
    title: "Act",
    text: "Farmers get simple alerts in their own language: when to irrigate, what to watch for.",
  },
];

const platform = [
  {
    icon: Radio,
    title: "Smart Farm Monitor",
    status: "In development",
    text: "Our first product. An affordable IoT unit that tracks the soil and farm conditions that matter most for irrigation and crop decisions.",
  },
  {
    icon: Satellite,
    title: "Smart Farm Station",
    status: "Research",
    text: "An integrated station combining soil, weather and environmental data for a fuller picture of field conditions.",
  },
  {
    icon: Languages,
    title: "Farmer app & voice alerts",
    status: "Planned",
    text: "A simple app with spoken alerts in Telugu, Hindi, English, Tamil and Kannada, designed for farmers first.",
  },
];

const process = [
  {
    icon: Search,
    title: "Understand the problem",
    text: "We talk with farmers and agricultural professionals to find the recurring challenges worth solving.",
  },
  {
    icon: ClipboardCheck,
    title: "Collect real evidence",
    text: "We compare field observations with soil, crop, weather and expert information.",
  },
  {
    icon: Wrench,
    title: "Build and test",
    text: "We build prototypes and test them under real field conditions, not just in the lab.",
  },
  {
    icon: RefreshCw,
    title: "Improve continuously",
    text: "Field feedback drives every change to accuracy, cost and ease of use.",
  },
];

const roadmap = [
  {
    phase: "Now",
    title: "Smart Farm Monitor",
    text: "Building and validating an affordable IoT monitoring system for key farm parameters.",
  },
  {
    phase: "Next",
    title: "Field validation",
    text: "Pilots with farmers and agricultural experts to test the technology in real conditions.",
  },
  {
    phase: "Later",
    title: "Agricultural intelligence",
    text: "Systems that combine farm data with agricultural knowledge to give useful advice.",
  },
  {
    phase: "Vision",
    title: "Smart farming ecosystem",
    text: "Soil, crop, weather and environmental data connected in one farming platform.",
  },
];

const audiences = [
  {
    icon: Tractor,
    title: "Farmers & FPOs",
    text: "Interested in piloting our technology on your fields? We'd love to learn from you.",
  },
  {
    icon: Handshake,
    title: "Investors & partners",
    text: "Talk to us about supporting an early-stage AgriTech company built from the field up.",
  },
  {
    icon: Building2,
    title: "Institutions",
    text: "Universities, KVKs and research groups: let's collaborate on field validation.",
  },
];

const faqs = [
  {
    q: "What is LR AgroSense?",
    a: "LR AgroSense is an early-stage AgriTech startup from India building affordable, practical technology that helps farmers make better decisions using real field data.",
  },
  {
    q: "What is your first product?",
    a: "The Smart Farm Monitor, an IoT-based system that measures soil moisture, pH, NPK nutrients, temperature and humidity. It is currently in development and testing.",
  },
  {
    q: "Can I buy the Smart Farm Monitor today?",
    a: "Not yet. We are still building and validating it. If you'd like to pilot it on your farm or be notified at launch, email us.",
  },
  {
    q: "Who are you building for?",
    a: "Indian farmers first, especially small and medium farms, along with FPOs, agricultural professionals and researchers who work with farm data.",
  },
  {
    q: "Can students join LR AgroSense?",
    a: "Yes. We offer remote internships for students interested in agriculture, technology, research, content and business.",
  },
];

/* -----------------------------------------------------------
   PAGE
----------------------------------------------------------- */

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const go = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="top">
      {/* NAVBAR */}
      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="container nav-inner">
          <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">
              <Sprout size={18} strokeWidth={2.4} />
            </span>
            <span className="brand-name">
              LR <b>AgroSense</b>
            </span>
          </a>

          <nav className="nav-links">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => go(l.id)}>
                {l.label}
              </button>
            ))}
          </nav>

          <button className="btn btn-small nav-cta" onClick={() => go("contact")}>
            Contact us
          </button>

          <button
            className="nav-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {navLinks.map((l) => (
            <button key={l.id} onClick={() => go(l.id)}>
              {l.label}
              <ArrowRight size={18} />
            </button>
          ))}
          <button className="btn" onClick={() => go("contact")}>
            Contact us
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow eyebrow-light">
                <span className="dot" /> Early-stage AgriTech · India
              </span>
              <h1>
                Know your soil.
                <br />
                <em>Grow with confidence.</em>
              </h1>
              <p className="hero-lead">
                LR AgroSense builds affordable IoT and AI tools that turn field
                data into simple, timely advice, so farmers can save water,
                use fertilizer wisely and protect their crops.
              </p>
              <div className="hero-actions">
                <button className="btn btn-accent" onClick={() => go("product")}>
                  See our product <ArrowRight size={18} />
                </button>
                <button className="btn btn-ghost" onClick={() => go("contact")}>
                  Partner with us
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-photo">
                <img src="/assets/agri_hero_bg.jpg" alt="Green crop fields at sunrise" />
              </div>
              <div className="reading-card">
                <div className="reading-head">
                  <span>Field 01 · Paddy</span>
                  <span className="live">
                    <span className="dot" /> Prototype preview
                  </span>
                </div>
                <div className="reading-grid">
                  <Reading label="Moisture" value="38" unit="%" fill={38} />
                  <Reading label="Soil pH" value="6.8" unit="" fill={68} />
                  <Reading label="Temp" value="29" unit="°C" fill={58} />
                  <Reading label="Humidity" value="71" unit="%" fill={71} />
                </div>
                <div className="reading-alert">
                  <Droplets size={16} />
                  Soil is drying. Irrigate within 24 hours.
                </div>
              </div>
            </div>
          </div>

          <div className="container measures">
            <span className="measures-label">What we measure</span>
            <div className="measures-list">
              {measures.map(({ icon: Icon, label }) => (
                <span key={label} className="measure">
                  <Icon size={16} /> {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">The problem</span>
              <h2>Too many farm decisions are still made by guesswork.</h2>
              <p>
                Farmers deal with water stress, rising input costs, pests and
                unpredictable weather, often without the information they need
                at the moment they need it.
              </p>
            </div>
            <div className="cards-3">
              {problems.map(({ icon: Icon, title, text }) => (
                <article key={title} className="card">
                  <span className="icon-chip">
                    <Icon size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT */}
        <section id="product" className="section section-tint">
          <div className="container product-grid">
            <div>
              <span className="eyebrow">Our first product</span>
              <h2>Smart Farm Monitor</h2>
              <p className="lead">
                A rugged, low-cost sensor unit that sits in the field and
                watches the conditions that drive crop health, around the
                clock.
              </p>
              <ul className="checks">
                <li>Measures soil moisture, pH, NPK, temperature and humidity</li>
                <li>Designed to be affordable for small and medium farms</li>
                <li>Sends readings to the cloud for history and analysis</li>
                <li>Plain-language alerts instead of complicated charts</li>
              </ul>
              <div className="status-row">
                <span className="badge">In development</span>
                <span className="muted">Currently in prototyping and field testing</span>
              </div>
            </div>

            <div className="device-wrap">
              <div className="device">
                <div className="device-antenna" />
                <div className="device-body">
                  <div className="device-screen">
                    <span className="device-brand">LR AgroSense</span>
                    <span className="device-model">Smart Farm Monitor</span>
                    <div className="device-lights">
                      <i /> <i /> <i />
                    </div>
                  </div>
                </div>
                <div className="device-probe" />
              </div>
              <div className="device-ground" />
              {measures.map(({ icon: Icon, label }, i) => (
                <span key={label} className={`float-tag tag-${i}`}>
                  <Icon size={14} /> {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="section">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">How it works</span>
              <h2>From the field to a clear decision.</h2>
            </div>
            <div className="steps">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="step">
                  <div className="step-top">
                    <span className="step-icon">
                      <Icon size={22} />
                    </span>
                    <span className="step-num">0{i + 1}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow eyebrow-light">The platform</span>
              <h2>One sensor today. A farming platform tomorrow.</h2>
              <p>
                Our roadmap connects field sensing, agricultural data and
                intelligent software into one long-term ecosystem for farmers.
              </p>
            </div>
            <div className="cards-3">
              {platform.map(({ icon: Icon, title, status, text }) => (
                <article key={title} className="card card-dark">
                  <div className="card-top">
                    <span className="icon-chip icon-chip-dark">
                      <Icon size={20} />
                    </span>
                    <span className="badge badge-dark">{status}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE BUILD */}
        <section className="section">
          <div className="container split">
            <div className="split-head">
              <span className="eyebrow">How we build</span>
              <h2>We start with the problem, not the product.</h2>
              <p>
                We research real farmer problems and validate in the field
                before making claims about what our technology can do.
              </p>
            </div>
            <div className="process">
              {process.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="process-item">
                  <span className="process-num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>
                      <Icon size={18} /> {title}
                    </h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section id="roadmap" className="section section-tint">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Roadmap</span>
              <h2>Building step by step.</h2>
            </div>
            <div className="roadmap">
              {roadmap.map((r, i) => (
                <div key={r.title} className={`road ${i === 0 ? "road-active" : ""}`}>
                  <span className="road-dot" />
                  <span className="road-phase">{r.phase}</span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section">
          <div className="container about-grid">
            <div>
              <span className="eyebrow">About us</span>
              <h2>Built by agriculture people, for farmers.</h2>
              <p className="lead">
                LR AgroSense is an early-stage AgriTech startup on a mission to
                make smart farming affordable and practical for Indian farmers.
              </p>
              <div className="mv">
                <div>
                  <h3>Mission</h3>
                  <p>
                    Develop affordable smart agriculture technology that helps
                    farmers improve productivity, reduce losses and use
                    resources efficiently.
                  </p>
                </div>
                <div>
                  <h3>Vision</h3>
                  <p>
                    Help farmers adopt smarter, more sustainable and data-driven
                    practices, and become a leading AgriTech company along the way.
                  </p>
                </div>
              </div>
            </div>

            <div className="founder">
              <div className="founder-avatar">HS</div>
              <div>
                <span className="founder-role">Founder</span>
                <h3>Pampana Hari Sai Ganesh</h3>
                <p>
                  B.Sc. Agriculture student who started LR AgroSense to bring
                  practical, affordable technology to the farmers he studies
                  and works alongside.
                </p>
                <a href={LINKEDIN} target="_blank" rel="noreferrer" className="link">
                  <Linkedin size={16} /> Follow on LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CAREERS — internships load live from the admin portal */}
        <Internships />

        {/* FAQ */}
        <section className="section">
          <div className="container split">
            <div className="split-head">
              <span className="eyebrow">FAQ</span>
              <h2>Questions, answered.</h2>
              <p>
                Can't find what you're looking for? Write to us at{" "}
                <a href={`mailto:${EMAIL}`} className="inline-link">
                  {EMAIL}
                </a>
                .
              </p>
            </div>
            <div className="faq">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className={`faq-item ${open ? "open" : ""}`}>
                    <button onClick={() => setOpenFaq(open ? null : i)}>
                      <span>{f.q}</span>
                      <ChevronDown size={20} />
                    </button>
                    <div className="faq-answer">
                      <p>{f.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section section-dark contact">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow eyebrow-light">Work with us</span>
              <h2>Let's build the future of farming together.</h2>
            </div>
            <div className="cards-3">
              {audiences.map(({ icon: Icon, title, text }) => (
                <article key={title} className="card card-dark">
                  <span className="icon-chip icon-chip-dark">
                    <Icon size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="contact-actions">
              <a className="btn btn-accent" href={`mailto:${EMAIL}`}>
                <Mail size={18} /> {EMAIL}
              </a>
              <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noreferrer">
                <Linkedin size={18} /> LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <a href="#top" className="brand">
              <span className="brand-mark">
                <Sprout size={18} strokeWidth={2.4} />
              </span>
              <span className="brand-name">
                LR <b>AgroSense</b>
              </span>
            </a>
            <p className="footer-tag">
              Affordable technology for smarter, more sustainable agriculture.
            </p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => go(l.id)}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href={`mailto:${EMAIL}`}>
              <Mail size={15} /> {EMAIL}
            </a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer">
              <Linkedin size={15} /> LinkedIn
            </a>
            <span>
              <MapPin size={15} /> India
            </span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} LR AgroSense. All rights reserved.</span>
          <span>Smart Farming · IoT</span>
        </div>
      </footer>
    </div>
  );
}

function Reading({ label, value, unit, fill }) {
  return (
    <div className="reading">
      <span className="reading-label">{label}</span>
      <span className="reading-value">
        {value}
        <small>{unit}</small>
      </span>
      <span className="reading-bar">
        <span style={{ width: `${fill}%` }} />
      </span>
    </div>
  );
}

export default App;
