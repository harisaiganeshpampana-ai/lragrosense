import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Droplets,
  Radio,
  Power,
  Zap,
  BellRing,
  MessageSquare,
  Phone,
  Moon,
  Sprout,
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
  ShieldAlert,
  GraduationCap,
  Code2,
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
  { id: "apps", label: "Apps" },
  { id: "roadmap", label: "Roadmap" },
  { id: "about", label: "About" },
  { href: "/internships.html", label: "Internships" },
];

const measures = [
  { icon: MessageSquare, label: "Motor on/off by SMS" },
  { icon: Droplets, label: "Auto-stop when soil is wet" },
  { icon: Zap, label: "Power on/off alerts" },
  { icon: Phone, label: "Works on any basic phone" },
];

// Short SMS conversation shown in the hero (prototype preview)
const smsChat = [
  { from: "farmer", text: "MOTOR ON" },
  { from: "device", text: "Motor is ON. Soil moisture 31%." },
  { from: "device", text: "Field is wet enough (62%). Motor stopped automatically." },
  { from: "device", text: "Power cut at 2:14 PM. Motor is OFF." },
];

const problems = [
  {
    icon: Moon,
    title: "Trips to the pump at all hours",
    text: "Farm power often comes at odd hours, even late at night. Farmers walk to the field just to switch the motor on or off.",
  },
  {
    icon: Droplets,
    title: "Water is used by guesswork",
    text: "Without knowing what the soil actually holds, fields get watered too much or too little, wasting water and power while stressing the crop.",
  },
  {
    icon: ShieldAlert,
    title: "Power cuts go unnoticed",
    text: "When power goes off or comes back, nobody knows. Irrigation stops halfway, or the motor runs longer than it should.",
  },
];

const steps = [
  {
    icon: MessageSquare,
    title: "Send an SMS",
    text: "The farmer texts MOTOR ON or MOTOR OFF from any phone, even a basic keypad phone. No internet or app needed.",
  },
  {
    icon: Power,
    title: "Pump switches",
    text: "The controller at the pump receives the message over the mobile network and switches the motor safely.",
  },
  {
    icon: Droplets,
    title: "Soil is watched",
    text: "A soil moisture sensor checks the field. When the soil is wet enough, the pump stops by itself.",
  },
  {
    icon: BellRing,
    title: "Farmer is told",
    text: "The farmer gets an SMS when the motor starts or stops and when power goes off or comes back.",
  },
];

const platform = [
  {
    icon: Power,
    title: "SMS Pump Controller",
    status: "In development",
    text: "Our first product. Switch the farm pump on or off by SMS, stop it automatically when the soil is wet, and get power alerts.",
  },
  {
    icon: Radio,
    title: "Smart Farm Monitor",
    status: "Research",
    text: "A field unit that tracks soil moisture, temperature and humidity over time for better irrigation decisions.",
  },
  {
    icon: Languages,
    title: "Farmer app & voice alerts",
    status: "Planned",
    text: "A simple app with spoken alerts in Telugu, Hindi, English, Tamil and Kannada, designed for farmers first.",
  },
];

const apps = [
  {
    icon: GraduationCap,
    name: "LR AgriPrep",
    url: "https://lragriprep.in",
    domain: "lragriprep.in",
    tag: "Education",
    text: "AI tutor for agriculture students preparing for ICAR, ASRB, IBPS AFO, NABARD, AEO and B.Sc. Agriculture exams. Doubt solving, crop photo doctor, practice quizzes and progress tracking in English, Hindi and Telugu.",
  },
  {
    icon: Code2,
    name: "Datta AI",
    url: "https://datta-ai.com",
    domain: "datta-ai.com",
    tag: "AI assistant",
    text: "A free AI assistant that's strong at coding. Describe an app and Datta AI writes the code and runs it right away.",
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
    title: "SMS Pump Controller",
    text: "Building and testing the prototype step by step, first with a small test pump on the bench.",
  },
  {
    phase: "Next",
    title: "Field pilots",
    text: "Pilots on real farms, with every farm motor connected by a licensed electrician.",
  },
  {
    phase: "Later",
    title: "Smart Farm Monitor",
    text: "Field monitoring of soil moisture, temperature and humidity, connected with the pump controller.",
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
    a: "The SMS Pump Controller. Farmers can switch their motor on or off from any phone by SMS, the pump stops automatically when the field is wet enough, and they get alerts when power goes off or comes back. It is currently in development.",
  },
  {
    q: "Do farmers need a smartphone or internet?",
    a: "No. It works with simple SMS messages, so any basic keypad phone with a SIM is enough.",
  },
  {
    q: "Can I buy the SMS Pump Controller today?",
    a: "Not yet. We are still building and testing the prototype. If you'd like to pilot it on your farm or be notified at launch, email us.",
  },
  {
    q: "Is it safe to connect to my farm motor?",
    a: "Safety comes first. During pilots, the controller will be connected to real farm motors only by a licensed electrician.",
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
            {navLinks.map((l) =>
              l.href ? (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ) : (
                <button key={l.id} onClick={() => go(l.id)}>
                  {l.label}
                </button>
              )
            )}
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
          {navLinks.map((l) =>
            l.href ? (
              <a key={l.label} href={l.href} className="mobile-link">
                {l.label}
                <ArrowRight size={18} />
              </a>
            ) : (
              <button key={l.id} onClick={() => go(l.id)}>
                {l.label}
                <ArrowRight size={18} />
              </button>
            )
          )}
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
                Run your farm pump
                <br />
                <em>from any phone.</em>
              </h1>
              <p className="hero-lead">
                Our SMS Pump Controller lets farmers switch their motor on or
                off with a simple text message, stops the pump when the field
                is wet enough, and sends power alerts. No smartphone or
                internet needed.
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
              <div className="reading-card sms-card">
                <div className="reading-head">
                  <span>
                    <MessageSquare size={14} /> Pump · Field 01
                  </span>
                  <span className="live">
                    <span className="dot" /> Prototype preview
                  </span>
                </div>
                <div className="sms-thread">
                  {smsChat.map((m, i) => (
                    <p key={i} className={`sms sms-${m.from}`}>
                      {m.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="container measures">
            <span className="measures-label">What it does</span>
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
              <h2>SMS Pump Controller</h2>
              <p className="lead">
                A low-cost controller that sits next to the farm pump, so
                farmers don't have to walk to the field just to switch the
                motor on or off.
              </p>
              <ul className="checks">
                <li>Switch the motor on or off by SMS from any phone</li>
                <li>Pump stops automatically when the field is wet enough</li>
                <li>SMS alerts when power goes off or comes back</li>
                <li>No smartphone, internet or app needed</li>
                <li>Designed to be affordable for small and medium farms</li>
              </ul>
              <div className="status-row">
                <span className="badge">In development</span>
                <span className="muted">
                  Prototype stage. Farm motors are connected only by a licensed electrician.
                </span>
              </div>
            </div>

            <div className="device-wrap">
              <div className="device">
                <div className="device-antenna" />
                <div className="device-body">
                  <div className="device-screen">
                    <span className="device-brand">LR AgroSense</span>
                    <span className="device-model">SMS Pump Controller</span>
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

        {/* APPS */}
        <section id="apps" className="section section-tint">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Our apps</span>
              <h2>Products by LR AgroSense, already live.</h2>
              <p>
                Alongside our farm technology, we build AI apps that people use
                every day.
              </p>
            </div>
            <div className="apps-grid">
              {apps.map(({ icon: Icon, name, url, domain, tag, text }) => (
                <a key={name} className="card app-tile" href={url} target="_blank" rel="noopener">
                  <div className="card-top">
                    <span className="icon-chip">
                      <Icon size={20} />
                    </span>
                    <span className="badge">Live · {tag}</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{text}</p>
                  <span className="app-link">
                    {domain} <ArrowUpRight size={16} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow eyebrow-light">The platform</span>
              <h2>One pump controller today. A farming platform tomorrow.</h2>
              <p>
                Our roadmap connects pump control, field sensing and simple
                software into one long-term ecosystem for farmers.
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
            {navLinks.map((l) =>
              l.href ? (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ) : (
                <button key={l.id} onClick={() => go(l.id)}>
                  {l.label}
                </button>
              )
            )}
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
              <MapPin size={15} /> Eluru, Andhra Pradesh
            </span>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms &amp; Conditions</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} LR AgroSense. All rights reserved.</span>
          <span className="msme-badge" title="Registered under the Ministry of MSME, Government of India">
            MSME Registered · UDYAM-AP-19-0077611
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
