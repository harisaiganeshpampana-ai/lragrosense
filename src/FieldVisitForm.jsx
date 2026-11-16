import React, { useEffect, useState } from "react";
import { Camera, CheckCircle2, Loader2, MapPin, X } from "lucide-react";
import { portalApi, todayISO } from "./portalApi";

const DEFAULT_PROBLEMS = [
  "Walking to the field to switch the motor",
  "Night-time power supply",
  "Power cuts / low voltage",
  "Motor burning / repairs",
  "Over or under watering",
  "Water shortage / borewell drying",
  "Labour shortage",
  "Pests and diseases",
  "Low crop prices / market",
  "High input costs",
  "Weather / cyclone damage",
  "Lack of credit / loans",
];

const DISTRICTS = [
  "Eluru",
  "West Godavari",
  "East Godavari",
  "Dr. B.R. Ambedkar Konaseema",
  "Kakinada",
  "Krishna",
  "NTR",
  "Guntur",
  "Palnadu",
  "Bapatla",
  "Prakasam",
  "Other (AP)",
  "Telangana",
  "Other state",
];

function makeEmptyForm() {
  return {
    visitDate: todayISO(),
    farmerName: "",
    farmerPhone: "",
    village: "",
    mandal: "",
    district: "",
    crops: "",
    landAcres: "",
    waterSource: "",
    irrigationMethod: "",
    pumpType: "",
    pumpHP: "",
    phoneType: "",
    problems: [],
    otherProblems: "",
    biggestProblem: "",
    interest: "",
    priceRange: "",
    notes: "",
    consent: false,
  };
}

// Shrinks the photo so it uploads quickly on mobile data, and returns JPEG text
function compressPhoto(file, maxSide = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve({ preview: dataUrl, base64: dataUrl.split(",")[1] || "" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not open this photo. Please choose a JPG or PNG photo."));
    };
    img.src = url;
  });
}

export default function FieldVisitForm({ token, onAuthError, onSubmitted }) {
  const [form, setForm] = useState(makeEmptyForm);
  const [problemList, setProblemList] = useState(DEFAULT_PROBLEMS);
  const [photo, setPhoto] = useState(null); // { preview, base64, takenAt }
  const [photoBusy, setPhotoBusy] = useState(false);
  const [location, setLocation] = useState(null); // { lat, lng }
  const [locating, setLocating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    portalApi("/api/intern/config", { token })
      .then((data) => {
        if (Array.isArray(data.problems) && data.problems.length) setProblemList(data.problems);
      })
      .catch((err) => {
        if (err.status === 401) onAuthError();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleProblem = (p) =>
    setForm((f) => ({
      ...f,
      problems: f.problems.includes(p) ? f.problems.filter((x) => x !== p) : [...f.problems, p],
    }));

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setPhotoBusy(true);
    try {
      const result = await compressPhoto(file);
      setPhoto({
        ...result,
        takenAt: file.lastModified ? new Date(file.lastModified).toISOString() : null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setPhotoBusy(false);
    }
  };

  const addLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not available on this phone. You can skip it.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        });
        setLocating(false);
      },
      () => {
        setError("Could not get your location. Please allow location, or skip it.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!photo) {
      setError("Please add a photo with the farmer (with date and time visible).");
      return;
    }
    if (!form.consent) {
      setError("Please confirm the farmer agreed to share these details.");
      return;
    }
    setSending(true);
    try {
      await portalApi("/api/intern/field-reports", {
        token,
        method: "POST",
        body: {
          ...form,
          photo: photo.base64,
          photoTakenAt: photo.takenAt,
          lat: location?.lat ?? null,
          lng: location?.lng ?? null,
        },
      });
      setCount((c) => c + 1);
      setDone(true);
      if (onSubmitted) onSubmitted();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const startNext = () => {
    setForm(makeEmptyForm());
    setPhoto(null);
    setLocation(null);
    setError("");
    setDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fr-form">
        {done ? (
          <div className="fr-card fr-done">
            <CheckCircle2 size={48} />
            <h2>Report submitted. Thank you!</h2>
            <p>
              {count === 1
                ? "Your first report this session is saved."
                : `${count} reports submitted this session.`}{" "}
              Your team lead will review it.
            </p>
            <button className="fr-btn fr-btn-primary" onClick={startNext}>
              Add another farmer
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate={false}>
            {/* Visit */}
            <section className="fr-card">
              <h2>
                <span>1</span> Visit date
              </h2>
              <div className="fr-grid">
                <label className="fr-field">
                  Date you met the farmer *
                  <input required type="date" max={todayISO()} value={form.visitDate} onChange={set("visitDate")} />
                </label>
              </div>
            </section>

            {/* Farmer */}
            <section className="fr-card">
              <h2>
                <span>2</span> Farmer details
              </h2>
              <div className="fr-grid">
                <label className="fr-field">
                  Farmer name *
                  <input required value={form.farmerName} onChange={set("farmerName")} maxLength={100} />
                </label>
                <label className="fr-field">
                  Farmer phone (only if they agree)
                  <input type="tel" inputMode="tel" value={form.farmerPhone} onChange={set("farmerPhone")} maxLength={20} />
                </label>
                <label className="fr-field">
                  Village *
                  <input required value={form.village} onChange={set("village")} maxLength={100} />
                </label>
                <label className="fr-field">
                  Mandal
                  <input value={form.mandal} onChange={set("mandal")} maxLength={100} />
                </label>
                <label className="fr-field">
                  District *
                  <select required value={form.district} onChange={set("district")}>
                    <option value="">Choose district</option>
                    {DISTRICTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <label className="fr-field">
                  Phone the farmer uses
                  <select value={form.phoneType} onChange={set("phoneType")}>
                    <option value="">Choose</option>
                    <option>Smartphone</option>
                    <option>Keypad (basic) phone</option>
                    <option>No phone</option>
                  </select>
                </label>
              </div>
            </section>

            {/* Farm */}
            <section className="fr-card">
              <h2>
                <span>3</span> Farm & water
              </h2>
              <div className="fr-grid">
                <label className="fr-field fr-wide">
                  Crops grown *
                  <input
                    required
                    placeholder="e.g. Paddy, banana, chilli"
                    value={form.crops}
                    onChange={set("crops")}
                    maxLength={200}
                  />
                </label>
                <label className="fr-field">
                  Land (acres)
                  <input type="number" inputMode="decimal" min="0" step="0.1" value={form.landAcres} onChange={set("landAcres")} />
                </label>
                <label className="fr-field">
                  Water source
                  <select value={form.waterSource} onChange={set("waterSource")}>
                    <option value="">Choose</option>
                    <option>Borewell</option>
                    <option>Open well</option>
                    <option>Canal</option>
                    <option>Tank / pond</option>
                    <option>Rain-fed only</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="fr-field">
                  Irrigation method
                  <select value={form.irrigationMethod} onChange={set("irrigationMethod")}>
                    <option value="">Choose</option>
                    <option>Flood</option>
                    <option>Drip</option>
                    <option>Sprinkler</option>
                    <option>Furrow</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="fr-field">
                  Pump type
                  <select value={form.pumpType} onChange={set("pumpType")}>
                    <option value="">Choose</option>
                    <option>Submersible (borewell)</option>
                    <option>Monoblock</option>
                    <option>Solar pump</option>
                    <option>Diesel pump</option>
                    <option>No pump</option>
                  </select>
                </label>
                <label className="fr-field">
                  Pump power (HP)
                  <input type="number" inputMode="decimal" min="0" step="0.5" value={form.pumpHP} onChange={set("pumpHP")} />
                </label>
              </div>
            </section>

            {/* Problems */}
            <section className="fr-card">
              <h2>
                <span>4</span> Farmer's problems
              </h2>
              <p className="fr-hint">Tick everything the farmer mentions.</p>
              <div className="fr-checks">
                {problemList.map((p) => (
                  <label key={p} className={`fr-check ${form.problems.includes(p) ? "on" : ""}`}>
                    <input type="checkbox" checked={form.problems.includes(p)} onChange={() => toggleProblem(p)} />
                    {p}
                  </label>
                ))}
              </div>
              <label className="fr-field">
                Other problems
                <textarea rows={2} value={form.otherProblems} onChange={set("otherProblems")} maxLength={1500} />
              </label>
              <label className="fr-field">
                Biggest problem, in the farmer's own words *
                <textarea
                  required
                  rows={3}
                  placeholder="Write what the farmer said (Telugu or English is fine)"
                  value={form.biggestProblem}
                  onChange={set("biggestProblem")}
                  maxLength={1500}
                />
              </label>
            </section>

            {/* Interest */}
            <section className="fr-card">
              <h2>
                <span>5</span> Pump controller interest
              </h2>
              <p className="fr-hint">
                Explain: "A device that switches your motor ON/OFF from your phone (even a keypad
                phone) and stops it automatically when the field is wet."
              </p>
              <div className="fr-grid">
                <label className="fr-field">
                  Would they use it?
                  <select value={form.interest} onChange={set("interest")}>
                    <option value="">Choose</option>
                    <option>Yes</option>
                    <option>Maybe</option>
                    <option>No</option>
                  </select>
                </label>
                <label className="fr-field">
                  How much would they pay?
                  <select value={form.priceRange} onChange={set("priceRange")}>
                    <option value="">Choose</option>
                    <option>Nothing / only free</option>
                    <option>Under ₹2,000</option>
                    <option>₹2,000 – ₹4,000</option>
                    <option>₹4,000 – ₹7,000</option>
                    <option>Above ₹7,000</option>
                    <option>Not sure</option>
                  </select>
                </label>
                <label className="fr-field fr-wide">
                  Any other notes
                  <textarea rows={2} value={form.notes} onChange={set("notes")} maxLength={2000} />
                </label>
              </div>
            </section>

            {/* Proof */}
            <section className="fr-card">
              <h2>
                <span>6</span> Photo proof
              </h2>
              <p className="fr-hint">
                Take a photo with the farmer using a timestamp camera app (date and time visible on
                the photo).
              </p>

              {photo ? (
                <div className="fr-photo">
                  <img src={photo.preview} alt="Visit with farmer" />
                  <button type="button" className="fr-photo-x" onClick={() => setPhoto(null)} aria-label="Remove photo">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="fr-upload">
                  {photoBusy ? <Loader2 size={22} className="spin" /> : <Camera size={22} />}
                  <span>{photoBusy ? "Preparing photo…" : "Add photo with farmer *"}</span>
                  <input type="file" accept="image/*" onChange={pickPhoto} hidden />
                </label>
              )}

              <button type="button" className="fr-btn fr-btn-light" onClick={addLocation} disabled={locating}>
                {locating ? <Loader2 size={16} className="spin" /> : <MapPin size={16} />}
                {location ? `Location added (${location.lat}, ${location.lng})` : "Add my location (optional)"}
              </button>

              <label className="fr-consent">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                />
                The farmer agreed to share these details and the photo with LR AgroSense for research. *
              </label>


            </section>

            {error && <div className="fr-error">{error}</div>}

            <button type="submit" className="fr-btn fr-btn-primary fr-submit" disabled={sending || photoBusy}>
              {sending ? (
                <>
                  <Loader2 size={18} className="spin" /> Submitting…
                </>
              ) : (
                "Submit report"
              )}
            </button>
            <p className="fr-foot">Problems with this form? Message your team lead.</p>
          </form>
        )}
    </div>
  );
}
