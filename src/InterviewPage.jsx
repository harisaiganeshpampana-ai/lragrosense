import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Mic,
  RotateCcw,
  Send,
  Square,
  Sprout,
  Volume2,
} from "lucide-react";
import { API_BASE, CONTACT_EMAIL } from "./config";

const SpeechRecognition =
  typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

async function call(path, body) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Could not reach the server. Please check your internet and try again.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

/* ---------- Voice (interviewer speaking) ---------- */

// Tiny silent sound, played on the first tap so phones allow audio later
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
const player = typeof Audio !== "undefined" ? new Audio() : null;
const voiceUrls = new Map(); // message number -> downloaded voice clip
let playId = 0;

function unlockAudio() {
  if (!player) return;
  player.src = SILENT_WAV;
  player.play().catch(() => {});
}

// Backup voice (built into the browser) — picks a male English voice if there is one
const MALE = /(male|ravi|rishi|hemant|prabhat|madhur|daniel|david|mark|guy|george|james|fred|aaron|arthur)/i;
const FEMALE = /(female|heera|kalpana|veena|neerja|swara|zira|susan|samantha|karen|moira|tessa|victoria|serena|fiona)/i;

function pickVoice() {
  if (!canSpeak) return null;
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((v) => /^en/i.test(v.lang));
  const indian = english.filter((v) => /en[-_]IN/i.test(v.lang));
  return (
    indian.find((v) => MALE.test(v.name)) ||
    english.find((v) => MALE.test(v.name)) ||
    indian.find((v) => !FEMALE.test(v.name)) ||
    english.find((v) => !FEMALE.test(v.name)) ||
    english[0] ||
    null
  );
}

function browserSpeak(text, id, { onStart, onEnd } = {}) {
  if (!canSpeak || !text) {
    onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  // Long text is split into sentences so Chrome doesn't cut it off
  const parts = text.match(/[^.!?]+[.!?]*/g)?.map((p) => p.trim()).filter(Boolean) || [text];
  const voice = pickVoice();
  let finished = false;
  const done = () => {
    if (finished || id !== playId) return;
    finished = true;
    onEnd?.();
  };
  parts.forEach((part, index) => {
    const u = new SpeechSynthesisUtterance(part);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || "en-IN";
    u.rate = 0.95;
    u.pitch = 0.9;
    if (index === 0) u.onstart = () => id === playId && onStart?.();
    if (index === parts.length - 1) {
      u.onend = done;
      u.onerror = done;
    }
    synth.speak(u);
  });
  // Safety: some phones never fire "end"
  setTimeout(done, Math.max(4000, text.length * 110));
}

// Plays the natural voice from our server; falls back to the browser voice if needed
async function speak(token, index, text, { onStart, onEnd } = {}) {
  const id = ++playId;
  stopSound();
  if (!text) {
    onEnd?.();
    return;
  }
  const fallback = () => {
    if (id === playId) browserSpeak(text, id, { onStart, onEnd });
  };
  if (!player || index < 0) return fallback();
  try {
    let url = voiceUrls.get(index);
    if (!url) {
      const response = await fetch(
        `${API_BASE}/api/interview/${encodeURIComponent(token)}/voice?i=${index}`
      );
      if (!response.ok) throw new Error("no voice");
      url = URL.createObjectURL(await response.blob());
      voiceUrls.set(index, url);
    }
    if (id !== playId) return;
    let finished = false;
    const done = () => {
      if (finished || id !== playId) return;
      finished = true;
      onEnd?.();
    };
    player.onplaying = () => id === playId && onStart?.();
    player.onended = done;
    player.onerror = () => {
      if (!finished) {
        finished = true;
        fallback();
      }
    };
    player.src = url;
    await player.play();
  } catch {
    fallback();
  }
}

function stopSound() {
  if (player) {
    player.onended = null;
    player.onerror = null;
    player.pause();
  }
  if (canSpeak) window.speechSynthesis.cancel();
}

function stopSpeaking() {
  playId += 1;
  stopSound();
}

function lastAiIndex(messages = []) {
  for (let i = messages.length - 1; i >= 0; i -= 1) if (messages[i].role === "ai") return i;
  return -1;
}

/* ---------- Page ---------- */

export default function InterviewPage() {
  const token = new URLSearchParams(window.location.search).get("t") || "";
  const [stage, setStage] = useState("loading"); // loading | error | intro | interview | done
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (canSpeak) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    if (!token) {
      setError("This interview link is not complete. Please open the full link you received.");
      setStage("error");
      return;
    }
    call(`/api/interview/${encodeURIComponent(token)}`)
      .then((data) => {
        setInfo(data);
        if (data.status === "completed") setStage("done");
        else if (data.expired) {
          setError("This interview link has expired. Please contact LR AgroSense for a new link.");
          setStage("error");
        } else setStage("intro");
      })
      .catch((err) => {
        setError(err.message);
        setStage("error");
      });
    return () => stopSpeaking();
  }, [token]);

  return (
    <div className="iv-page">
      <header className="iv-bar">
        <a href="/" className="iv-brand">
          <span className="brand-mark">
            <Sprout size={18} />
          </span>
          <span>
            LR <b>AgroSense</b>
          </span>
        </a>
        <span className="iv-tag">AI Interview</span>
      </header>

      <main className="iv-main">
        {stage === "loading" && (
          <div className="iv-card iv-center">
            <Loader2 size={34} className="iv-spin" />
            <p>Loading your interview… (this can take up to a minute the first time)</p>
          </div>
        )}

        {stage === "error" && (
          <div className="iv-card iv-center">
            <AlertTriangle size={40} className="iv-warn" />
            <h1>Can't open this interview</h1>
            <p>{error}</p>
            <p className="iv-small">
              Need help? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        )}

        {stage === "intro" && info && (
          <Intro info={info} token={token} onStarted={(data) => {
            setInfo(data);
            setStage(data.status === "completed" ? "done" : "interview");
          }} />
        )}

        {stage === "interview" && info && (
          <Interview
            token={token}
            info={info}
            setInfo={setInfo}
            onDone={() => setStage("done")}
          />
        )}

        {stage === "done" && info && <Done info={info} token={token} />}
      </main>
    </div>
  );
}

/* ---------- Before starting ---------- */

function Intro({ info, token, onStarted }) {
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const resuming = info.status === "in_progress" && info.messages.length > 0;

  const start = async () => {
    setError("");
    setBusy(true);
    try {
      // Ask for microphone permission now (works best right after a tap)
      if (SpeechRecognition && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          setError(
            "Microphone is blocked. You can still type your answers, or allow the microphone in your browser settings and reload."
          );
        }
      }
      // Unlock sound on phones (must happen right after a tap)
      unlockAudio();
      if (canSpeak) {
        const u = new SpeechSynthesisUtterance(" ");
        u.volume = 0;
        window.speechSynthesis.speak(u);
      }
      const data = await call(`/api/interview/${encodeURIComponent(token)}/start`, {});
      onStarted(data);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="iv-card">
      <span className="iv-kicker">{info.internshipTitle}</span>
      <h1>
        Hi {info.candidateFirstName || "there"}, welcome to your interview{resuming ? " (continue)" : ""}
      </h1>
      <p className="iv-lead">
        Your interviewer today is <b>{info.interviewerName || "Arjun"}</b>, LR AgroSense's AI
        interviewer. It's a friendly voice chat of about <b>{info.questionCount} questions</b>.{" "}
        {info.interviewerName || "Arjun"} speaks each question, and you answer by speaking —
        just like a normal call.
      </p>

      <ul className="iv-tips">
        <li>Takes about 10–15 minutes. Sit in a quiet place.</li>
        <li>Use <b>Google Chrome</b> on your phone or laptop for the best voice support.</li>
        <li>Tap the microphone, speak your answer, check the text, then tap <b>Send answer</b>.</li>
        <li>You can also type or correct your answer before sending.</li>
        <li>Answer honestly in your own words. Simple English is perfectly fine.</li>
      </ul>

      {!SpeechRecognition && (
        <p className="iv-note">
          Voice answers don't work in this browser. You can still type your answers, or open this
          link in Google Chrome to speak.
        </p>
      )}

      <label className="iv-check">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>
          I understand this interview is taken by AI. My answers are turned into text and saved,
          and the LR AgroSense team will review them. A person makes the final decision. I agree to
          the{" "}
          <a href="/privacy.html" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error && <p className="iv-error">{error}</p>}

      <button className="iv-btn iv-btn-big" disabled={!agree || busy} onClick={start}>
        {busy ? <Loader2 size={20} className="iv-spin" /> : <Mic size={20} />}
        {busy ? "Starting…" : resuming ? "Continue interview" : "Start interview"}
      </button>
    </div>
  );
}

/* ---------- The interview ---------- */

function Interview({ token, info, setInfo, onDone }) {
  const [answer, setAnswer] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const recRef = useRef(null);
  const wantListen = useRef(false);
  const answerRef = useRef("");

  const aiIndex = lastAiIndex(info.messages);
  const lastAi = aiIndex >= 0 ? info.messages[aiIndex].text : "";
  const name = info.interviewerName || "Arjun";
  const [preparing, setPreparing] = useState(false);
  const questionNo = Math.min(info.answered + 1, info.questionCount);

  const updateAnswer = (text) => {
    answerRef.current = text;
    setAnswer(text);
  };

  /* Listening (student speaking) */
  const startRecognition = useCallback(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.continuous = false; // one sentence at a time; restarts automatically (works best on phones)
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      if (finalText.trim()) {
        const base = answerRef.current.trim();
        updateAnswer(base ? `${base} ${finalText.trim()}` : finalText.trim());
        setInterim("");
      } else {
        setInterim(interimText);
      }
    };
    rec.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        wantListen.current = false;
        setError("Microphone is blocked. Please allow it in your browser, or type your answer.");
      }
    };
    rec.onend = () => {
      setInterim("");
      if (wantListen.current) {
        setTimeout(() => {
          if (wantListen.current) startRecognition();
        }, 150);
      } else {
        setListening(false);
      }
    };
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      /* already started */
    }
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    stopSpeaking();
    setSpeaking(false);
    setError("");
    wantListen.current = true;
    setListening(true);
    startRecognition();
  }, [startRecognition]);

  const stopListening = useCallback(() => {
    wantListen.current = false;
    setListening(false);
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
  }, []);

  /* Speak each new question, then start listening automatically */
  const playQuestion = useCallback(
    (autoListen = true) => {
      stopListening();
      setPreparing(true);
      speak(token, aiIndex, lastAi, {
        onStart: () => {
          setPreparing(false);
          setSpeaking(true);
        },
        onEnd: () => {
          setPreparing(false);
          setSpeaking(false);
          if (autoListen && SpeechRecognition) startListening();
        },
      });
    },
    [token, aiIndex, lastAi, startListening, stopListening]
  );

  useEffect(() => {
    if (lastAi) playQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiIndex]);

  useEffect(
    () => () => {
      wantListen.current = false;
      try {
        recRef.current?.abort();
      } catch {
        /* ignore */
      }
      stopSpeaking();
    },
    []
  );

  const send = async () => {
    const text = `${answerRef.current} ${interim}`.trim();
    if (text.length < 2) {
      setError("Please say or type your answer first.");
      return;
    }
    stopListening();
    stopSpeaking();
    setSpeaking(false);
    setPreparing(false);
    setError("");
    setSending(true);
    try {
      const data = await call(`/api/interview/${encodeURIComponent(token)}/answer`, { text });
      updateAnswer("");
      setInterim("");
      if (data.status === "completed") {
        setInfo({ ...data, justFinished: true });
        onDone();
      } else {
        setInfo(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const progress = Math.round((info.answered / info.questionCount) * 100);

  return (
    <div className="iv-card iv-live">
      <div className="iv-progress">
        <span>
          Question {questionNo} of {info.questionCount}
        </span>
        <div className="iv-progress-bar">
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="iv-ai">
        <div
          className={`iv-orb ${speaking ? "is-speaking" : ""} ${
            sending || preparing ? "is-thinking" : ""
          }`}
        >
          <span />
          <b className="iv-initial">{name.charAt(0)}</b>
        </div>
        <p className="iv-ai-name">{name}</p>
        <p className="iv-ai-status">
          {sending || preparing
            ? `${name} is thinking…`
            : speaking
            ? `${name} is speaking…`
            : "LR AgroSense · AI interviewer"}
        </p>
        <p className="iv-question">{lastAi}</p>
        {canSpeak && (
          <button
            className="iv-link"
            onClick={() => playQuestion(false)}
            disabled={sending || preparing}
          >
            <Volume2 size={16} /> Repeat question
          </button>
        )}
      </div>

      <div className="iv-answer">
        <div className="iv-answer-head">
          <span>Your answer</span>
          {answer && !listening && (
            <button className="iv-link" onClick={() => updateAnswer("")} disabled={sending}>
              <RotateCcw size={14} /> Clear
            </button>
          )}
        </div>
        <textarea
          value={answer + (interim ? `${answer ? " " : ""}${interim}` : "")}
          onChange={(e) => {
            setInterim("");
            updateAnswer(e.target.value);
          }}
          placeholder={
            SpeechRecognition
              ? "Tap the microphone and speak. Your words will appear here."
              : "Type your answer here."
          }
          rows={5}
          maxLength={3000}
          disabled={sending}
        />

        {error && <p className="iv-error">{error}</p>}

        <div className="iv-controls">
          {SpeechRecognition && (
            <button
              className={`iv-mic ${listening ? "is-on" : ""}`}
              onClick={listening ? stopListening : startListening}
              disabled={sending}
              aria-label={listening ? "Stop listening" : "Start speaking"}
            >
              {listening ? <Square size={22} /> : <Mic size={26} />}
            </button>
          )}
          <div className="iv-mic-label">
            {listening ? (
              <>
                <b className="iv-live-dot">Listening…</b> tap ■ when you finish
              </>
            ) : SpeechRecognition ? (
              "Tap the mic to speak"
            ) : (
              "Type your answer"
            )}
          </div>
          <button className="iv-btn" onClick={send} disabled={sending || !(answer || interim).trim()}>
            {sending ? <Loader2 size={18} className="iv-spin" /> : <Send size={18} />}
            {sending ? "Sending…" : "Send answer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Finished ---------- */

function Done({ info, token }) {
  const closingIndex = lastAiIndex(info.messages);
  const closing = closingIndex >= 0 ? info.messages[closingIndex].text : "";

  // Say the goodbye message aloud right after the last answer
  useEffect(() => {
    if (info.justFinished && closing) speak(token, closingIndex, closing);
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="iv-card iv-center">
      <CheckCircle2 size={56} className="iv-ok" />
      <h1>Interview completed</h1>
      <p className="iv-lead">
        {closing ||
          "Thank you for taking the interview. The LR AgroSense team will review it and contact you by email."}
      </p>
      <p className="iv-small">
        You can close this page now. Questions? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
      <a className="iv-btn iv-btn-light" href="/">
        Go to LR AgroSense website
      </a>
    </div>
  );
}
