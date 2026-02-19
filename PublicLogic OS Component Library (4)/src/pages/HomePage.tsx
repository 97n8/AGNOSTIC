import React, { useState } from "react";
import {
  CheckCircle2,
  ShieldAlert,
  Clock,
  Scale,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "motion/react";

// ── Config ────────────────────────────────────────────────────────────────
const PRR_ENDPOINT = "/public/prr";
const PRR_STATUS_BASE = "/prr/status";
const WORKSPACE_ID = "default"; // set dynamically if multi-tenant

const LEGAL_NOTICE =
  "This request is submitted under M.G.L. c. 66 §10 and 950 CMR 32.00. " +
  "The Town of Phillipston must respond within 10 business days unless a valid extension applies.";

const CATEGORIES = [
  "Assessors' Records",
  "Building Permits",
  "Town Clerk Records",
  "Public Safety Reports",
  "Financial / Budget Records",
  "Meeting Minutes / Agendas",
  "Other",
] as const;

// ── Types ─────────────────────────────────────────────────────────────────
interface PRRResponse {
  success: boolean;
  data?: { public_token: string };
  error?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function buildStatusUrl(token: string) {
  return `${PRR_STATUS_BASE}?token=${encodeURIComponent(token)}`;
}

// ── Component ─────────────────────────────────────────────────────────────
export function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Submission ──────────────────────────────────────────────────────────
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const category = data.get("category") as string;
    const description = (data.get("description") as string).trim();

    const payload = {
      workspace_id: WORKSPACE_ID,
      name: (data.get("name") as string).trim(),
      email: (data.get("email") as string).trim(),
      // Prefix the summary with category so operators get context at a glance
      summary: `[${category}] ${description.slice(0, 120)}${description.length > 120 ? "…" : ""}`,
      details: description || null,
    };

    try {
      const res = await fetch(PRR_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json: PRRResponse = await res.json();

      if (!res.ok || !json.success || !json.data?.public_token) {
        throw new Error(
          json.error || `Server returned ${res.status}. Please try again.`
        );
      }

      setToken(json.data.public_token);
      form.reset();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Copy token ──────────────────────────────────────────────────────────
  const copyToken = () => {
    if (!token) return;
    navigator.clipboard
      .writeText(token)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#09090b", color: "#f4f4f5" }}>

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid #27272a",
          background: "#18181b",
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <Scale size={22} style={{ color: "#34d399" }} />
        <div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#f4f4f5" }}>
            Resident Records Portal
          </span>
          <span
            style={{
              marginLeft: 12,
              fontSize: 12,
              color: "#a1a1aa",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Town of Phillipston
          </span>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Page title */}
        <div style={{ marginBottom: 36 }}>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f4f4f5",
              marginBottom: 6,
            }}
          >
            Public Records Request
          </h2>
          <p style={{ fontSize: 14, color: "#a1a1aa" }}>
            M.G.L. c. 66 §10 — submit your request below and receive a tracking
            token to monitor status.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>

          {/* ── Main form / success card ────────────────────────────── */}
          <div>
            <AnimatePresence mode="wait">
              {token ? (
                // ── Success state ───────────────────────────────────
                <Motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: 16,
                    padding: "40px 32px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <CheckCircle2 size={28} style={{ color: "#10b981" }} />
                  </div>

                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                    Request Filed
                  </h3>
                  <p style={{ fontSize: 14, color: "#a1a1aa", marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>
                    Your request has been submitted to the Municipal Archive.
                    Save your tracking token to check status.
                  </p>

                  {/* Token display */}
                  <div
                    style={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: 10,
                      padding: "14px 20px",
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      fontSize: 13,
                      color: "#34d399",
                      letterSpacing: "0.06em",
                      wordBreak: "break-all",
                      marginBottom: 16,
                    }}
                  >
                    {token}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={copyToken}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "9px 18px",
                        background: copied ? "rgba(16,185,129,0.15)" : "#27272a",
                        border: copied ? "1px solid rgba(16,185,129,0.4)" : "1px solid #3f3f46",
                        borderRadius: 8,
                        color: copied ? "#34d399" : "#f4f4f5",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <Copy size={14} />
                      {copied ? "Copied!" : "Copy Token"}
                    </button>

                    <a
                      href={buildStatusUrl(token)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "9px 18px",
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        borderRadius: 8,
                        color: "#34d399",
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <ExternalLink size={14} />
                      Check Status
                    </a>

                    <button
                      onClick={() => { setToken(null); setError(null); }}
                      style={{
                        padding: "9px 18px",
                        background: "transparent",
                        border: "1px solid #27272a",
                        borderRadius: 8,
                        color: "#a1a1aa",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      File Another
                    </button>
                  </div>
                </Motion.div>

              ) : (
                // ── Form state ──────────────────────────────────────
                <Motion.div
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: 16,
                    padding: "32px",
                  }}
                >
                  {/* Error banner */}
                  <AnimatePresence>
                    {error && (
                      <Motion.div
                        key="err"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "12px 14px",
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          borderRadius: 8,
                          marginBottom: 24,
                          color: "#fca5a5",
                          fontSize: 13,
                        }}
                      >
                        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>{error}</span>
                      </Motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Name + Email */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <FieldGroup label="Full Legal Name">
                        <input
                          name="name"
                          required
                          placeholder="Jane Sullivan"
                          style={inputStyle}
                        />
                      </FieldGroup>
                      <FieldGroup label="Contact Email">
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          style={inputStyle}
                        />
                      </FieldGroup>
                    </div>

                    {/* Category */}
                    <FieldGroup label="Record Category">
                      <select name="category" style={inputStyle} defaultValue={CATEGORIES[0]}>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </FieldGroup>

                    {/* Description / Details */}
                    <FieldGroup
                      label="Request Description"
                      hint="Include relevant dates, addresses, document types, or other specifics. This becomes the record of your request."
                    >
                      <textarea
                        name="description"
                        required
                        placeholder="Describe the specific records you are requesting…"
                        style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
                      />
                    </FieldGroup>

                    {/* Acknowledgment */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "14px 16px",
                        background: "#09090b",
                        border: "1px solid #27272a",
                        borderRadius: 8,
                      }}
                    >
                      <input
                        id="ack"
                        type="checkbox"
                        name="ack"
                        required
                        style={{ marginTop: 2, accentColor: "#10b981", flexShrink: 0 }}
                      />
                      <label
                        htmlFor="ack"
                        style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.55, cursor: "pointer" }}
                      >
                        I understand this is a public records request submitted under M.G.L. c. 66,
                        and that my name and the nature of my request constitute a public record.
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: "100%",
                        padding: "13px 0",
                        background: isSubmitting
                          ? "rgba(16,185,129,0.35)"
                          : "rgba(16,185,129,0.9)",
                        border: "none",
                        borderRadius: 10,
                        color: "#051a0d",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner /> Submitting…
                        </>
                      ) : (
                        "File Official Request"
                      )}
                    </button>

                  </form>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Response protocol */}
            <Sidebar
              icon={<Clock size={14} />}
              title="Response Protocol"
              accentColor="#10b981"
            >
              <p style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.65 }}>
                {LEGAL_NOTICE}
              </p>
            </Sidebar>

            {/* Exemptions */}
            <Sidebar
              icon={<ShieldAlert size={14} />}
              title="Exemptions"
              accentColor="#8b5cf6"
            >
              <p style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.65 }}>
                Certain records are exempt under M.G.L. c. 4 §7(26), including
                personnel files, medical records, and active criminal investigation
                materials. Exempt records will be identified in the town's response.
              </p>
            </Sidebar>

            {/* Status check */}
            <Sidebar
              icon={<ExternalLink size={14} />}
              title="Track Your Request"
              accentColor="#f59e0b"
            >
              <p style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.65, marginBottom: 10 }}>
                After submitting, use your tracking token to check status at any time.
              </p>
              <a
                href={PRR_STATUS_BASE}
                style={{
                  display: "inline-block",
                  padding: "7px 14px",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: 6,
                  color: "#f59e0b",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Check Status →
              </a>
            </Sidebar>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#a1a1aa",
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <span style={{ fontSize: 11, color: "#52525b", lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}

function Sidebar({
  icon,
  title,
  accentColor,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 10,
          color: accentColor,
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      style={{ animation: "spin 700ms linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="7" cy="7" r="5" fill="none" stroke="rgba(5,26,13,0.3)" strokeWidth="2" />
      <path d="M7 2a5 5 0 0 1 5 5" fill="none" stroke="rgba(5,26,13,0.9)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Shared style ──────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "#09090b",
  border: "1px solid #27272a",
  borderRadius: 8,
  color: "#f4f4f5",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.15s",
};