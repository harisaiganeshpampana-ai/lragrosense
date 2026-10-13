import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Keyboard,
  Loader2,
  Mic,
  MicOff,
  Send,
  Sprout,
  Volume2,
} from "lucide-react";
import { API_BASE, CONTACT_EMAIL } from "./config";

const SpeechRecognition =
  typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

// How long the student must stay quiet before the answer is sent automatically
const AUTO_SEND_MS = 2600;
// How long to wait for the natural voice before using the backup voice
const VOICE_WAIT_MS = 9000;

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
let naturalFailures = 0; // after 2 failures we use the backup voice straight away

function unlockAudio() {
  if (!player) return;
  player.src = SILENT_WAV;
  player.play().catch(() => {});
}

// Backup voice (built into the browser): a clear male English voice
const MALE = /\b(male|ryan|george|daniel|thomas|guy|ravi|rishi|hemant|prabhat|madhur|david|mark|james|fred|aaron|arthur)\b/i;
const FEMALE = /\b(female|heera|kalpana|veena|neerja|swara|zira|susan|samantha|karen|moira|tessa|victoria|serena|fiona|libby|sonia|hazel)\b/i;

function pickVoice() {
  if (!canSpeak) return null;
  const all = window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
  const local = all.filter((v) => v.localService);
  for (const list of [local, all]) {
    const pick =
      list.find((v) => /en[-_]GB/i.test(v.lang) && MALE.test(v.name)) ||
      list.find((v) => /en[-_]IN/i.test(v.lang) && MALE.test(v.name)) ||
      list.find((v) => MALE.test(v.name)) ||
      list.find((v) => !FEMALE.test(v.name));
    if (pick) return pick;
  }
  return all[0] || null;
}

function browserSpeak(text, id, handlers = {}, firstTry = true) {
  const { onStart, onEnd, onBlocked } = handlers;
  if (!canSpeak || !text) {
    onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  // Chrome sometimes ignores speech that starts right after "cancel", so wait a moment
  setTimeout(() => {
    if (id !== playId) return;
    const parts = text.match(/[^.!?]+[.!?]*/g)?.map((p) => p.trim()).filter(Boolean) || [text];
    const voice = firstTry ? pickVoice() : null;
    let started = false;
    let finished = false;
    const done = () => {
      if (finished || id !== playId) return;
      finished = true;
      onEnd?.();
    };
    const retry = () => {
      if (finished || id !== playId) return;
      finished = true;
      synth.cancel();
      if (firstTry) browserSpeak(text, id, handlers, false); // try again with the default voice
      else onEnd?.();
    };
    parts.forEach((part, index) => {
      const u = new SpeechSynthesisUtterance(part);
      if (voice) u.voice = voice;
      u.lang = voice?.lang || "en-IN";
      u.rate = 1;
      u.pitch = 0.85;
      u.onstart = () => {
        if (started) return;
        started = true;
        if (id === playId) onStart?.();
      };
      u.onerror = (event) => {
        if (started) {
          if (index === parts.length - 1) done();
          return;
        }
        if (event.error === "not-allowed" && onBlocked) {
          finished = true;
          onBlocked();
        } else retry();
      };
      if (index === parts.length - 1) u.onend = done;
      synth.speak(u);
    });
    // If the voice hasn't started after 3 seconds, try the default voice
    setTimeout(() => {
      if (!started) retry();
    }, 3000);
    // Safety: some phones never say when speech ends
    setTimeout(() => {
      if (started) done();
    }, Math.max(6000, text.length * 120));
  }, 150);
}

// Plays the natural voice from our server; uses the backup voice if it is slow or fails
async function speak(token, index, text, handlers = {}) {
  const { onStart, onEnd, onBlocked } = handlers;
  const id = ++playId;
  stopSound();
  if (!text) {
    onEnd?.();
    return;
  }
  const fallback = () => {
    if (id === playId) browserSpeak(text, id, handlers);
  };
  let url = voiceUrls.get(index);
  if (!player || index < 0 || (!url && naturalFailures >= 2)) return fallback();
  try {
    if (!url) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), VOICE_WAIT_MS);
      const response = await fetch(
        `${API_BASE}/api/interview/${encodeURIComponent(token)}/voice?i=${index}`,
        { signal: controller.signal }
      );
      clearTimeout(timer);
      if (!response.ok) throw new Error("no voice");
      url = URL.createObjectURL(await response.blob());
      voiceUrls.set(index, url);
      naturalFailures = 0;
    }
  } catch {
    naturalFailures += 1;
    return fallback();
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
  try {
    await player.play();
  } catch (error) {
    if (finished || id !== playId) return;
    finished = true;
    // The browser blocked sound until the person taps the page
    if (error?.name === "NotAllowedError" && onBlocked) onBlocked();
    else fallback();
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

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/* ---------- Animated core ---------- */

function Core({ state, letter, onClick }) {
  return (
    <button
      type="button"
      className={`hud hud-${state}`}
      onClick={onClick}
      aria-label={state === "speaking" ? "Skip and answer now" : "Interviewer"}
    >
      <svg viewBox="0 0 220 220" aria-hidden="true">
        <defs>
          <radialGradient id="hudGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bfffee" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#3be8c8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0a3b3a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="hud-halo" cx="110" cy="110" r="104" fill="url(#hudGlow)" />
        <circle className="hud-ring hud-r1" cx="110" cy="110" r="100" />
        <circle className="hud-ring hud-r2" cx="110" cy="110" r="88" />
        <circle className="hud-ring hud-r3" cx="110" cy="110" r="76" />
        <circle className="hud-arc hud-a1" cx="110" cy="110" r="94" />
        <circle className="hud-arc hud-a2" cx="110" cy="110" r="82" />
        <g className="hud-ticks">
          {Array.from({ length: 36 }, (_, i) => (
            <line
              key={i}
              x1="110"
              y1="4"
              x2="110"
              y2={i % 3 === 0 ? "14" : "9"}
              transform={`rotate(${i * 10} 110 110)`}
            />
          ))}
        </g>
      </svg>
      <span className="hud-core">
        <b>{letter}</b>
      </span>
      <span className="hud-bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}

/* Shows the interviewer's words like subtitles, typing them out */
function Typewriter({ text }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    if (!text) return undefined;
    let i = 0;
    const timer = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, [text]);
  return (
    <p className="hud-subtitle" aria-live="polite">
      {shown}
      {shown.length < text.length && <span className="hud-caret" />}
    </p>
  );
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
      <div className="iv-grid" aria-hidden="true" />
      <header className="iv-bar">
        <a href="/" className="iv-brand">
          <span className="brand-mark">
            <Sprout size={18} />
          </span>
          <span>
            LR <b>AgroSense</b>
          </span>
        </a>
        <span className="iv-tag">
          <i /> AI Interview
        </span>
      </header>

      <main className="iv-main">
        {stage === "loading" && (
          <div className="iv-card iv-center">
            <Loader2 size={34} className="iv-spin" />
            <p>Connecting… (this can take up to a minute the first time)</p>
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
          <Intro
            info={info}
            token={token}
            onStarted={(data) => {
              setInfo(data);
              setStage(data.status === "completed" ? "done" : "interview");
            }}
          />
        )}

        {stage === "interview" && info && (
          <Interview token={token} info={info} setInfo={setInfo} onDone={() => setStage("done")} />
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
  const name = info.interviewerName || "Arjun";

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
    <div className="iv-card iv-intro">
      <div className="iv-intro-core">
        <Core state="idle" letter={name.charAt(0)} />
      </div>
      <span className="iv-kicker">{info.internshipTitle}</span>
      <h1>
        Hi {info.candidateFirstName || "there"}, I'm {name}.
      </h1>
      <p className="iv-lead">
        LR AgroSense's AI interviewer. We'll have a short, hands-free voice conversation of about{" "}
        <b>{info.questionCount} questions</b>
        {resuming ? " — let's continue where we stopped" : ""}.
      </p>

      <ul className="iv-tips">
        <li>
          <b>Just talk.</b> After I finish speaking, the mic turns on by itself. When you pause for
          a moment, your answer is sent automatically.
        </li>
        <li>
          Sit in a quiet place and use <b>Google Chrome</b> with sound on. Takes 10–15 minutes.
        </li>
        <li>You can also type, or tap the circle to skip my voice and answer straight away.</li>
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
        {busy ? "Connecting…" : resuming ? "Continue interview" : "Start interview"}
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
  const [preparing, setPreparing] = useState(false);
  const [sending, setSending] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [typing, setTyping] = useState(!SpeechRecognition);
  const [countdown, setCountdown] = useState(0); // changes each time the auto-send timer restarts
  const [error, setError] = useState("");

  const recRef = useRef(null);
  const wantListen = useRef(false);
  const answerRef = useRef("");
  const interimRef = useRef("");
  const silenceTimer = useRef(null);
  const sendRef = useRef(() => {});
  const typingRef = useRef(typing);
  typingRef.current = typing;

  const aiIndex = lastAiIndex(info.messages);
  const lastAi = aiIndex >= 0 ? info.messages[aiIndex].text : "";
  const name = info.interviewerName || "Arjun";
  const questionNo = Math.min(info.answered + 1, info.questionCount);

  const updateAnswer = (text) => {
    answerRef.current = text;
    setAnswer(text);
  };
  const updateInterim = (text) => {
    interimRef.current = text;
    setInterim(text);
  };

  const clearSilence = () => {
    clearTimeout(silenceTimer.current);
    setCountdown(0);
  };

  // Every time the student says something, restart the "send when quiet" timer
  const armSilence = useCallback(() => {
    clearTimeout(silenceTimer.current);
    if (typingRef.current || !wantListen.current) return;
    setCountdown((c) => c + 1);
    silenceTimer.current = setTimeout(() => {
      const text = `${answerRef.current} ${interimRef.current}`.trim();
      if (wantListen.current && !typingRef.current && wordCount(text) >= 2) sendRef.current();
      else setCountdown(0);
    }, AUTO_SEND_MS);
  }, []);

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
        updateInterim("");
      } else {
        updateInterim(interimText);
      }
      armSilence();
    };
    rec.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        wantListen.current = false;
        setTyping(true);
        setError("Microphone is blocked. Please allow it in your browser, or type your answer.");
      }
    };
    rec.onend = () => {
      updateInterim("");
      if (wantListen.current) {
        setTimeout(() => {
          if (wantListen.current) startRecognition();
        }, 120);
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
  }, [armSilence]);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    stopSpeaking();
    setSpeaking(false);
    setPreparing(false);
    setNeedsTap(false);
    setError("");
    wantListen.current = true;
    setListening(true);
    startRecognition();
  }, [startRecognition]);

  const stopListening = useCallback(() => {
    wantListen.current = false;
    clearSilence();
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
      setNeedsTap(false);
      setPreparing(true);
      speak(token, aiIndex, lastAi, {
        onBlocked: () => {
          setPreparing(false);
          setSpeaking(false);
          setNeedsTap(true);
        },
        onStart: () => {
          setPreparing(false);
          setSpeaking(true);
        },
        onEnd: () => {
          setPreparing(false);
          setSpeaking(false);
          if (autoListen && SpeechRecognition && !typingRef.current) startListening();
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
      clearTimeout(silenceTimer.current);
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
    const text = `${answerRef.current} ${interimRef.current}`.trim();
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
      updateInterim("");
      if (data.status === "completed") {
        setInfo({ ...data, justFinished: true });
        onDone();
      } else {
        setInfo(data);
      }
    } catch (err) {
      // Keep the answer so they can try again
      updateAnswer(text);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };
  sendRef.current = send;

  // Tapping the core: skip the voice and answer now, or start the mic
  const onCore = () => {
    if (sending) return;
    if (needsTap) {
      playQuestion(true);
      return;
    }
    if (speaking || preparing) {
      stopSpeaking();
      setSpeaking(false);
      setPreparing(false);
      if (SpeechRecognition && !typing) startListening();
      return;
    }
    if (!listening && SpeechRecognition && !typing) startListening();
  };

  const toggleTyping = () => {
    if (typing) {
      setTyping(false);
      if (SpeechRecognition) startListening();
    } else {
      stopListening();
      setTyping(true);
    }
  };

  const state = sending || preparing ? "thinking" : speaking ? "speaking" : listening ? "listening" : "idle";
  const statusText = {
    thinking: `${name} is thinking`,
    speaking: `${name} is speaking`,
    listening: "Listening",
    idle: typing ? "Type your answer" : "Tap the circle to talk",
  }[state];
  const progress = Math.round((info.answered / info.questionCount) * 100);
  const liveText = `${answer}${interim ? `${answer ? " " : ""}${interim}` : ""}`;

  return (
    <div className="iv-live">
      <div className="iv-progress">
        <span>
          {String(questionNo).padStart(2, "0")} / {String(info.questionCount).padStart(2, "0")}
        </span>
        <div className="iv-progress-bar">
          <i style={{ width: `${progress}%` }} />
        </div>
        <span className="iv-progress-name">{name.toUpperCase()}</span>
      </div>

      <div className="iv-stage">
        <Core state={state} letter={name.charAt(0)} onClick={onCore} />
        <p className={`hud-status hud-status-${state}`}>
          <i />
          {statusText}
          {state === "thinking" && <span className="hud-dots" />}
        </p>
        <Typewriter text={lastAi} />
        <div className="hud-actions">
          {needsTap ? (
            <button className="iv-btn iv-tap" onClick={() => playQuestion(true)}>
              <Volume2 size={18} /> Tap to hear {name}
            </button>
          ) : (
            <button
              className="iv-link"
              onClick={() => playQuestion(false)}
              disabled={sending || preparing}
            >
              <Volume2 size={15} /> Repeat
            </button>
          )}
        </div>
      </div>

      <div className={`iv-answer ${listening ? "is-live" : ""}`}>
        <div className="iv-answer-head">
          <span>You</span>
          {SpeechRecognition && (
            <button className="iv-link" onClick={toggleTyping} disabled={sending}>
              {typing ? <Mic size={14} /> : <Keyboard size={14} />}
              {typing ? "Speak instead" : "Type instead"}
            </button>
          )}
        </div>

        {typing ? (
          <textarea
            value={answer}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="Type your answer here."
            rows={4}
            maxLength={3000}
            disabled={sending}
            autoFocus
          />
        ) : (
          <p className={`iv-transcript ${liveText ? "" : "is-empty"}`}>
            {liveText ||
              (listening
                ? "Go ahead, I'm listening…"
                : sending
                ? "Sending…"
                : "Your words will appear here.")}
          </p>
        )}

        {!typing && listening && countdown > 0 && (
          <div className="iv-autosend" key={countdown}>
            <i style={{ animationDuration: `${AUTO_SEND_MS}ms` }} />
            <span>Sending when you pause…</span>
          </div>
        )}

        {error && <p className="iv-error">{error}</p>}

        <div className="iv-controls">
          {SpeechRecognition && !typing && (
            <button
              className={`iv-mic ${listening ? "is-on" : ""}`}
              onClick={listening ? stopListening : startListening}
              disabled={sending}
              aria-label={listening ? "Pause microphone" : "Start speaking"}
            >
              {listening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          {(answer || interim) && !sending && (
            <button className="iv-link" onClick={() => updateAnswer("")}>
              Clear
            </button>
          )}
          <button
            className="iv-btn iv-send"
            onClick={send}
            disabled={sending || !(answer || interim).trim()}
          >
            {sending ? <Loader2 size={18} className="iv-spin" /> : <Send size={18} />}
            {sending ? "Sending…" : "Send now"}
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
  const name = info.interviewerName || "Arjun";
  const [talking, setTalking] = useState(false);

  // Say the goodbye message aloud right after the last answer
  useEffect(() => {
    if (info.justFinished && closing) {
      speak(token, closingIndex, closing, {
        onStart: () => setTalking(true),
        onEnd: () => setTalking(false),
      });
    }
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="iv-card iv-center iv-done">
      <Core state={talking ? "speaking" : "idle"} letter={name.charAt(0)} />
      <h1>
        <CheckCircle2 size={26} className="iv-ok" /> Interview completed
      </h1>
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
