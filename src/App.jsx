import React, { useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Cpu,
  Leaf,
  Menu,
  MessageCircle,
  Microscope,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const [plantImage, setPlantImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setAnalysis("");

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setError("Please upload an image smaller than 12 MB.");
      return;
    }

    setPlantImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPlantImage(null);
    setImagePreview("");
    setAnalysis("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzePlant = async () => {
    setError("");
    setAnalysis("");

    if (!plantImage) {
      setError("Please upload a plant or crop image first.");
      return;
    }

    if (!question.trim()) {
      setError("Please ask LR AI a question about the plant.");
      return;
    }

    if (!API_BASE_URL) {
      setError(
        "LR AI is ready, but the secure AI server is not connected yet. The Gemini API key must be kept on the backend."
      );
      return;
    }

    try {
      setAnalyzing(true);

      const image = await fileToDataUrl(plantImage);

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "LR AI could not analyze the image.");
      }

      setAnalysis(data.answer || "No analysis was returned.");
    } catch (err) {
      setError(
        err.message || "Something went wrong while analyzing the image."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAI = () => {
    setPlantImage(null);
    setImagePreview("");
    setQuestion("");
    setAnalysis("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const scrollTo = (id) => {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="site-shell">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container navbar-inner">
          <button
            className="brand"
            onClick={() => scrollTo("home")}
            aria-label="LR AgroSense home"
          >
            <img
              src="/company_logo.jpg"
              alt="LR AgroSense"
              className="brand-logo"
            />
            <span>LR AgroSense</span>
          </button>

          <nav className={`nav-links ${mobileMenu ? "nav-open" : ""}`}>
            <button onClick={() => scrollTo("about")}>About</button>
            <button onClick={() => scrollTo("products")}>Products</button>
            <button onClick={() => scrollTo("technology")}>
              Technology
            </button>
            <button onClick={() => scrollTo("research")}>Research</button>
            <button onClick={() => scrollTo("roadmap")}>Roadmap</button>
            <button onClick={() => scrollTo("internships")}>
              Internships
            </button>
            <button onClick={() => scrollTo("contact")}>Contact</button>

            {/* LR AI */}
            <button
              className="lr-ai-nav"
              onClick={() => {
                setShowAI(true);
                setMobileMenu(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Sparkles size={16} />
              LR AI
            </button>

            <button
              className="nav-connect"
              onClick={() => scrollTo("contact")}
            >
              Connect
              <ArrowRight size={15} />
            </button>
          </nav>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu((value) => !value)}
            aria-label="Open navigation"
          >
            {mobileMenu ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      {/* HOME */}
      {!showAI ? (
        <main>
          <section id="home" className="hero-section">
            <div className="hero-overlay" />

            <div className="container hero-content">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  Building the future of agriculture
                </div>

                <h1>
                  Smarter farming.
                  <br />
                  <span>Better decisions.</span>
                </h1>

                <p>
                  LR AgroSense builds affordable agricultural technologies
                  combining IoT, soil monitoring, weather intelligence and AI
                  to help farmers make better decisions.
                </p>

                <div className="hero-actions">
                  <button
                    className="primary-button"
                    onClick={() => scrollTo("products")}
                  >
                    Explore Technology
                    <ArrowRight size={18} />
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => setShowAI(true)}
                  >
                    <Sparkles size={18} />
                    Try LR AI
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="section">
            <div className="container">
              <div className="section-heading">
                <span>ABOUT LR AGROSENSE</span>
                <h2>Technology built around real agricultural problems.</h2>
                <p>
                  We are developing affordable and practical technologies
                  designed around the needs of farmers.
                </p>
              </div>

              <div className="about-grid">
                <article className="info-card">
                  <Leaf size={28} />
                  <h3>Farmer First</h3>
                  <p>
                    Solutions are designed around real farm conditions,
                    practical decisions and affordability.
                  </p>
                </article>

                <article className="info-card">
                  <Cpu size={28} />
                  <h3>Smart Technology</h3>
                  <p>
                    IoT, sensors, cloud systems and AI work together to turn
                    agricultural data into useful information.
                  </p>
                </article>

                <article className="info-card">
                  <ShieldCheck size={28} />
                  <h3>Research First</h3>
                  <p>
                    We focus on testing, validation and field evidence before
                    making strong agricultural claims.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* PRODUCTS */}
          <section id="products" className="section section-soft">
            <div className="container">
              <div className="section-heading">
                <span>OUR TECHNOLOGY</span>
                <h2>Building an intelligent agricultural ecosystem.</h2>
                <p>
                  LR AgroSense is developing hardware, software and AI
                  technologies that can work together.
                </p>
              </div>

              <div className="product-grid">
                <article className="product-card">
                  <div className="product-icon">
                    <Cloud />
                  </div>
                  <h3>Smart Farm Monitor</h3>
                  <p>
                    Monitor important soil conditions such as moisture, pH,
                    temperature and nutrient-related parameters.
                  </p>
                  <span className="product-status">In Development</span>
                </article>

                <article className="product-card featured-product">
                  <div className="product-icon">
                    <Sparkles />
                  </div>
                  <h3>LR AI</h3>
                  <p>
                    AI-powered plant and crop analysis that lets farmers ask
                    questions using images and natural language.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => setShowAI(true)}
                  >
                    Open LR AI <ArrowRight size={16} />
                  </button>
                </article>

                <article className="product-card">
                  <div className="product-icon">
                    <Zap />
                  </div>
                  <h3>Smart Farm Station</h3>
                  <p>
                    A future farm intelligence station combining soil,
                    weather and environmental monitoring.
                  </p>
                  <span className="product-status">Research</span>
                </article>
              </div>
            </div>
          </section>

          {/* TECHNOLOGY */}
          <section id="technology" className="section">
            <div className="container">
              <div className="section-heading">
                <span>TECHNOLOGY</span>
                <h2>From farm data to useful decisions.</h2>
              </div>

              <div className="technology-grid">
                <article>
                  <Microscope />
                  <h3>Sensing</h3>
                  <p>
                    Agricultural sensors collect important information from
                    soil and the surrounding environment.
                  </p>
                </article>

                <article>
                  <Cloud />
                  <h3>Connectivity</h3>
                  <p>
                    Data can be transferred through connected IoT systems for
                    monitoring and analysis.
                  </p>
                </article>

                <article>
                  <Sparkles />
                  <h3>Artificial Intelligence</h3>
                  <p>
                    AI can combine agricultural information with farmer
                    questions to provide useful insights.
                  </p>
                </article>

                <article>
                  <MessageCircle />
                  <h3>Farmer Interface</h3>
                  <p>
                    Information should be understandable and actionable rather
                    than simply showing technical numbers.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* RESEARCH */}
          <section id="research" className="section section-dark">
            <div className="container">
              <div className="section-heading light-heading">
                <span>RESEARCH</span>
                <h2>We build with validation in mind.</h2>
                <p>
                  Agricultural technology needs evidence. Our research focuses
                  on understanding crop conditions, soil parameters, farmer
                  problems and field-level requirements.
                </p>
              </div>

              <div className="research-list">
                <div>
                  <CheckCircle2 />
                  <span>Field data collection</span>
                </div>
                <div>
                  <CheckCircle2 />
                  <span>Sensor validation</span>
                </div>
                <div>
                  <CheckCircle2 />
                  <span>Crop-health research</span>
                </div>
                <div>
                  <CheckCircle2 />
                  <span>AI model validation</span>
                </div>
              </div>
            </div>
          </section>

          {/* ROADMAP */}
          <section id="roadmap" className="section">
            <div className="container">
              <div className="section-heading">
                <span>ROADMAP</span>
                <h2>Building step by step.</h2>
              </div>

              <div className="roadmap">
                <div className="roadmap-item">
                  <span>01</span>
                  <div>
                    <h3>Smart Farm Monitor</h3>
                    <p>
                      Develop and validate the first affordable farm
                      monitoring system.
                    </p>
                  </div>
                </div>

                <div className="roadmap-item">
                  <span>02</span>
                  <div>
                    <h3>LR AI</h3>
                    <p>
                      Develop AI-powered crop and plant health analysis using
                      images and agricultural context.
                    </p>
                  </div>
                </div>

                <div className="roadmap-item">
                  <span>03</span>
                  <div>
                    <h3>Smart Farm Intelligence</h3>
                    <p>
                      Combine soil, weather, crop and AI information into a
                      connected agricultural intelligence platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INTERNSHIPS */}
          <section id="internships" className="section section-soft">
            <div className="container">
              <div className="section-heading">
                <span>INTERNSHIPS</span>
                <h2>Work on real agricultural technology problems.</h2>
                <p>
                  LR AgroSense offers project-based opportunities for students
                  interested in agriculture, IoT, AI, research and business.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => scrollTo("contact")}
              >
                Join LR AgroSense
                <ArrowRight size={18} />
              </button>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="section">
            <div className="container contact-box">
              <div>
                <span>CONTACT</span>
                <h2>Let's build the future of agriculture.</h2>
                <p>
                  Interested in collaborating, researching or working with LR
                  AgroSense?
                </p>
              </div>

              <a
                className="primary-button"
                href="mailto:contact@lragrosense.in"
              >
                Contact Us
                <ArrowRight size={18} />
              </a>
            </div>
          </section>
        </main>
      ) : (
        /* LR AI PAGE */
        <main className="lr-ai-page">
          <section className="lr-ai-hero">
            <div className="container">
              <button
                className="back-button"
                onClick={() => setShowAI(false)}
              >
                ← Back to LR AgroSense
              </button>

              <div className="lr-ai-title">
                <div className="ai-badge">
                  <Sparkles size={18} />
                  LR AI
                </div>

                <h1>
                  Ask questions about your
                  <span> plants and crops.</span>
                </h1>

                <p>
                  Upload a plant or crop image and ask LR AI what you want to
                  know. LR AI can analyze the visible condition and provide
                  possible causes, risks and practical next steps.
                </p>
              </div>

              <div className="lr-ai-workspace">
                <div className="ai-input-card">
                  <div className="ai-card-header">
                    <div>
                      <h2>Plant Analysis</h2>
                      <p>Upload an image to begin.</p>
                    </div>
                    <Camera size={24} />
                  </div>

                  {!imagePreview ? (
                    <button
                      className="upload-area"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={32} />
                      <strong>Upload plant image</strong>
                      <span>
                        JPG, PNG or WEBP · Maximum 12 MB
                      </span>
                    </button>
                  ) : (
                    <div className="image-preview-wrapper">
                      <img
                        src={imagePreview}
                        alt="Selected plant"
                        className="plant-preview"
                      />

                      <button
                        className="remove-image-button"
                        onClick={removeImage}
                        aria-label="Remove image"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />

                  <label className="question-label">
                    Ask LR AI
                  </label>

                  <textarea
                    className="ai-question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Example: Why are these leaves turning yellow?"
                    rows={5}
                  />

                  <div className="suggested-questions">
                    <button
                      onClick={() =>
                        setQuestion(
                          "What plant is this and what is its current condition?"
                        )
                      }
                    >
                      Identify this plant
                    </button>

                    <button
                      onClick={() =>
                        setQuestion(
                          "What disease or pest problem could be affecting this plant?"
                        )
                      }
                    >
                      Check disease
                    </button>

                    <button
                      onClick={() =>
                        setQuestion(
                          "Why are the leaves changing colour and what should I check?"
                        )
                      }
                    >
                      Check symptoms
                    </button>
                  </div>

                  {error && <div className="ai-error">{error}</div>}

                  <button
                    className="analyze-button"
                    onClick={analyzePlant}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <>
                        <span className="loading-dot" />
                        LR AI is analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Analyze with LR AI
                      </>
                    )}
                  </button>

                  {(plantImage || question || analysis) && (
                    <button className="reset-ai-button" onClick={resetAI}>
                      Start a new analysis
                    </button>
                  )}
                </div>

                <div className="ai-result-card">
                  <div className="ai-card-header">
                    <div>
                      <h2>LR AI Analysis</h2>
                      <p>Your agricultural analysis will appear here.</p>
                    </div>
                    <Sparkles size={24} />
                  </div>

                  {!analysis ? (
                    <div className="empty-analysis">
                      <div className="empty-analysis-icon">
                        <Leaf size={34} />
                      </div>

                      <h3>Ready to analyze</h3>

                      <p>
                        Upload a clear image of the plant, leaf, fruit or crop
                        and ask your question.
                      </p>

                      <div className="analysis-features">
                        <span>
                          <CheckCircle2 size={15} />
                          Plant identification
                        </span>

                        <span>
                          <CheckCircle2 size={15} />
                          Disease & pest possibilities
                        </span>

                        <span>
                          <CheckCircle2 size={15} />
                          Nutrient-stress possibilities
                        </span>

                        <span>
                          <CheckCircle2 size={15} />
                          Recommended next steps
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="analysis-result">
                      <div className="result-disclaimer">
                        <ShieldCheck size={17} />
                        AI analysis is an initial assessment. Confirm important
                        agricultural decisions with appropriate field or
                        laboratory testing.
                      </div>

                      <div className="analysis-text">
                        {analysis}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>LR AgroSense</strong>
            <p>
              Affordable technology for smarter and more sustainable
              agriculture.
            </p>
          </div>

          <div className="footer-right">
            <span>© {new Date().getFullYear()} LR AgroSense</span>
            <button onClick={() => setShowAI(true)}>
              ✦ LR AI
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
