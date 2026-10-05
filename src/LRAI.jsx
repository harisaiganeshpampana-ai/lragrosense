import React, { useRef, useState } from "react";
import {
  ArrowUp,
  Camera,
  Image as ImageIcon,
  Leaf,
  Menu,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/$/, "");

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function LRAI() {
  const fileInputRef = useRef(null);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setAnswer("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setError("Please select an image smaller than 12 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    setAnswer("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const askLR = async () => {
    setError("");
    setAnswer("");

    if (!image) {
      setError("Upload a plant or crop image first.");
      return;
    }

    if (!question.trim()) {
      setError("Ask LR AI a question about the image.");
      return;
    }

    if (!API_BASE_URL) {
      setError(
        "LR AI backend is not connected yet. Your Gemini API key must remain on the secure server."
      );
      return;
    }

    try {
      setLoading(true);

      const imageData = await fileToDataUrl(image);

      const response = await fetch(
        `${API_BASE_URL}/api/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageData,
            question: question.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "LR AI could not analyze the image."
        );
      }

      setAnswer(data.answer || "No answer was returned.");
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while connecting to LR AI."
      );
    } finally {
      setLoading(false);
    }
  };

  const newAnalysis = () => {
    setImage(null);
    setPreview("");
    setQuestion("");
    setAnswer("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="lr-ai-app">

      {/* HEADER */}

      <header className="lr-ai-header">
        <div className="lr-ai-header-inner">

          <a href="/lr-ai.html" className="lr-ai-brand">
            <div className="lr-ai-logo-mark">
              LR
            </div>

            <div>
              <strong>LR AI</strong>
              <span>Plant Intelligence</span>
            </div>
          </a>

          <nav
            className={`lr-ai-nav-menu ${
              mobileMenu ? "open" : ""
            }`}
          >
            <a href="#about">About</a>
            <a href="#how-it-works">How it works</a>

            <a
              href="https://lragrosense.in"
              className="company-link"
            >
              LR AgroSense
            </a>
          </nav>

          <button
            className="mobile-ai-menu"
            onClick={() =>
              setMobileMenu((value) => !value)
            }
          >
            {mobileMenu ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main>

        {/* HERO */}

        <section className="ai-hero">

          <div className="ai-container">

            <div className="ai-hero-copy">

              <div className="ai-label">
                <Sparkles size={15} />
                LR AI
              </div>

              <h1>
                Understand your
                <br />
                <span>plants better.</span>
              </h1>

              <p>
                Upload a plant or crop image and ask
                LR AI what you want to know.
              </p>

            </div>

            {/* AI WORKSPACE */}

            <div className="ai-workspace">

              {/* INPUT */}

              <section className="ai-panel">

                <div className="panel-title">
                  <div>
                    <h2>Ask LR AI</h2>
                    <p>
                      Upload an image and ask your
                      question.
                    </p>
                  </div>

                  <Sparkles size={19} />
                </div>

                {!preview ? (
                  <button
                    className="image-upload"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    <div className="upload-icon">
                      <ImageIcon size={23} />
                    </div>

                    <strong>
                      Upload plant image
                    </strong>

                    <span>
                      JPG, PNG or WEBP
                    </span>
                  </button>
                ) : (
                  <div className="selected-image">

                    <img
                      src={preview}
                      alt="Selected plant"
                    />

                    <button
                      className="remove-image"
                      onClick={removeImage}
                    >
                      <X size={17} />
                    </button>

                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />

                <div className="question-section">

                  <label>
                    Your question
                  </label>

                  <textarea
                    value={question}
                    onChange={(e) =>
                      setQuestion(e.target.value)
                    }
                    placeholder="What is happening to this plant?"
                  />

                </div>

                <div className="quick-questions">

                  <button
                    onClick={() =>
                      setQuestion(
                        "What plant is this?"
                      )
                    }
                  >
                    Identify plant
                  </button>

                  <button
                    onClick={() =>
                      setQuestion(
                        "What disease could affect this plant?"
                      )
                    }
                  >
                    Check disease
                  </button>

                  <button
                    onClick={() =>
                      setQuestion(
                        "Why are the leaves changing colour?"
                      )
                    }
                  >
                    Check symptoms
                  </button>

                </div>

                {error && (
                  <div className="ai-error">
                    {error}
                  </div>
                )}

                <button
                  className="ask-button"
                  onClick={askLR}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Ask LR AI
                      <ArrowUp size={17} />
                    </>
                  )}
                </button>

              </section>

              {/* RESPONSE */}

              <section className="ai-response">

                <div className="response-header">
                  <div className="response-avatar">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <strong>LR AI</strong>
                    <span>
                      Agricultural intelligence
                    </span>
                  </div>
                </div>

                {!answer ? (
                  <div className="response-empty">

                    <div className="leaf-icon">
                      <Leaf size={26} />
                    </div>

                    <h3>
                      Your analysis will appear here
                    </h3>

                    <p>
                      Upload an image and ask a
                      question to start.
                    </p>

                  </div>
                ) : (
                  <div className="response-content">

                    <div className="response-note">
                      LR AI provides an initial
                      assessment. Important agricultural
                      decisions should be confirmed with
                      appropriate field or laboratory
                      testing.
                    </div>

                    <div className="answer">
                      {answer}
                    </div>

                    <button
                      className="new-analysis"
                      onClick={newAnalysis}
                    >
                      <Plus size={16} />
                      New analysis
                    </button>

                  </div>
                )}

              </section>

            </div>

          </div>

        </section>

        {/* ABOUT */}

        <section
          id="about"
          className="ai-information"
        >
          <div className="ai-container">

            <div className="information-grid">

              <div>
                <span className="small-label">
                  ABOUT LR AI
                </span>

                <h2>
                  Agricultural intelligence,
                  made simple.
                </h2>
              </div>

              <p>
                LR AI is designed to help users
                understand plant and crop conditions
                using images, questions and
                agricultural intelligence.
              </p>

            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}

        <section
          id="how-it-works"
          className="how-section"
        >
          <div className="ai-container">

            <span className="small-label">
              HOW IT WORKS
            </span>

            <h2>
              From image to insight.
            </h2>

            <div className="steps">

              <div>
                <span>01</span>
                <h3>Upload</h3>
                <p>
                  Upload a clear image of your
                  plant or crop.
                </p>
              </div>

              <div>
                <span>02</span>
                <h3>Ask</h3>
                <p>
                  Ask LR AI a question in normal
                  language.
                </p>
              </div>

              <div>
                <span>03</span>
                <h3>Understand</h3>
                <p>
                  Receive an AI-powered analysis
                  and practical next steps.
                </p>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}

      <footer className="lr-ai-footer">
        <div className="ai-container">

          <div className="footer-ai-brand">
            <div className="lr-ai-logo-mark">
              LR
            </div>

            <div>
              <strong>LR AI</strong>
              <span>
                Plant & Crop Intelligence
              </span>
            </div>
          </div>

          <div>
            © {new Date().getFullYear()} LR AI
          </div>

        </div>
      </footer>

    </div>
  );
}
