import { API_BASE } from "./config";

// Saves the login on this device (separately for each portal)
export function readSession(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

export function saveSession(key, session) {
  try {
    if (session) localStorage.setItem(key, JSON.stringify(session));
    else localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export async function portalApi(path, { token, method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Could not reach the server. It may be waking up. Please wait 30 seconds and try again.");
  }
  let data = {};
  try {
    data = await response.json();
  } catch {
    /* empty */
  }
  if (!response.ok) {
    const error = new Error(data.error || "Something went wrong.");
    error.status = response.status;
    throw error;
  }
  return data;
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// Downloads a shared file with the login token and returns a temporary link to it
const fileCache = new Map();
export async function portalFileUrl(id, token) {
  if (fileCache.has(id)) return fileCache.get(id);
  const response = await fetch(`${API_BASE}/api/workspace/files/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const error = new Error(response.status === 404 ? "File not found (it may have been deleted)." : "Could not open the file.");
    error.status = response.status;
    throw error;
  }
  const url = URL.createObjectURL(await response.blob());
  fileCache.set(id, url);
  return url;
}

export function fileSizeLabel(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Reads a picked file as base64 for upload
export function readFileBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}
