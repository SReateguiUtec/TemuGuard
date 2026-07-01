import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, ScanLine, RefreshCw } from "lucide-react";
import type { ProductData } from "./ProductOverview";

interface AnalysisResult {
  fidelity_score: number;
  positive_reality: string[];
  critical_alerts: string[];
  verdict: string;
}

function ScoreRing({ score }: { score: number }) {
  const pct = score / 5;
  const size = 120;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  const color = score >= 4 ? "#4ade80" : score >= 2.5 ? "#FFB347" : "#f87171";
  const label = score >= 4 ? "CONFIABLE" : score >= 2.5 ? "DUDOSO" : "ALERTA";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: 26,
            color,
            lineHeight: 1,
          }}
        >
          {score.toFixed(1)}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color,
            opacity: 0.8,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

interface FilterProps {
  product: ProductData;
}

export default function AntiDeceptionFilter({ product }: FilterProps) {
  const [status, setStatus] = useState<"idle" | "analyzing" | "result" | "error">("idle");
  const [resultData, setResultData] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAnalyze = async () => {
    setStatus("analyzing");

    try {
      const payload = {
        product_name: product.name,
        images: product.images,
        reviews: product.reviews.map((r) => ({
          title: r.title,
          content: r.content,
          rating: r.rating,
        })),
      };

      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al conectar con el motor de IA");
      }

      const data: AnalysisResult = await response.json();
      setResultData(data);
      setStatus("result");
    } catch (error: unknown) {
      console.error("Error AI:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocurrió un error inesperado al consultar la IA.");
      }
      setStatus("error");
    }
  };

  return (
    <div
      className="card-premium"
      style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px",
          background: "rgba(10,10,11,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, rgba(255,107,43,0.2), rgba(255,179,71,0.05))",
              border: "1px solid rgba(255,107,43,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles style={{ width: 16, height: 16, color: "#FF6B2B" }} />
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            Filtro Antiengaño IA
          </h2>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(255,107,43,0.7)",
              background: "rgba(255,107,43,0.08)",
              border: "1px solid rgba(255,107,43,0.15)",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            GEMINI 3.5
          </div>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.5 }}>
          IA multimodal analiza imágenes y {product.reviews.length} reseñas reales para revelar la verdad.
        </p>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: status === "result" ? "flex-start" : "center",
          padding: "20px 24px 24px",
          overflowY: "auto",
        }}
        className="custom-scrollbar"
      >
        <AnimatePresence mode="wait">
          {/* IDLE */}
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
            >
              <div
                style={{
                  width: 160,
                  height: 100,
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "rgba(255,107,43,0.04)",
                  border: "1px solid rgba(255,107,43,0.12)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "0 30%",
                    top: 16,
                    bottom: 16,
                    borderLeft: "1px solid rgba(255,107,43,0.2)",
                    borderRight: "1px solid rgba(255,107,43,0.2)",
                  }}
                />
                {[20, 40, 60, 80].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${20 + i * 5}%`,
                      right: `${20 + i * 5}%`,
                      top: 14 + i * 14,
                      height: 1,
                      background: `rgba(255,107,43,${0.08 + i * 0.04})`,
                    }}
                  />
                ))}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "linear-gradient(90deg, transparent, #FF6B2B, transparent)",
                    boxShadow: "0 0 12px rgba(255,107,43,0.6)",
                    top: "30%",
                    opacity: 0.7,
                  }}
                  className="animate-scan"
                />
              </div>

              <button
                onClick={handleAnalyze}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 28px",
                  background: "linear-gradient(135deg, #FF6B2B, #E55820)",
                  border: "none",
                  borderRadius: 14,
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#fff",
                  letterSpacing: "0.02em",
                  boxShadow: "0 8px 32px rgba(255,107,43,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <ScanLine style={{ width: 17, height: 17 }} />
                Analizar con IA
              </button>
            </motion.div>
          )}

          {/* ANALYZING */}
          {status === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                textAlign: "center",
              }}
            >
              <div style={{ position: "relative", width: 72, height: 72 }}>
                <div
                  className="animate-pulse-ring"
                  style={{
                    position: "absolute",
                    inset: -10,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,107,43,0.3)",
                  }}
                />
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(255,107,43,0.1)",
                    border: "1px solid rgba(255,107,43,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ScanLine
                    style={{ width: 28, height: 28, color: "#FF6B2B" }}
                    className="animate-pulse"
                  />
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#EEEEF5",
                    margin: "0 0 6px",
                  }}
                >
                  Analizando producto...
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                  Gemini 3.5 Flash comparando {product.reviews.length} reseñas con imágenes
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B2B" }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "rgba(248,113,113,0.06)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 16,
                padding: "28px 24px",
                textAlign: "center",
              }}
            >
              <XCircle style={{ width: 36, height: 36, color: "#f87171", margin: "0 auto 12px" }} />
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#f87171",
                  margin: "0 0 8px",
                }}
              >
                Error de Conexión
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 20px", lineHeight: 1.5 }}>
                {errorMessage}
              </p>
              <button
                onClick={() => setStatus("idle")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: "#E8E8F0",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <RefreshCw style={{ width: 14, height: 14 }} />
                Intentar de nuevo
              </button>
            </motion.div>
          )}

          {/* RESULT */}
          {status === "result" && resultData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Score header */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <ScoreRing score={resultData.fidelity_score} />
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Score de Fidelidad
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.5,
                    }}
                  >
                    Basado en análisis multimodal de imágenes y sentimiento de reseñas.
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      height: 4,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(resultData.fidelity_score / 5) * 100}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                      style={{
                        height: "100%",
                        borderRadius: 99,
                        background:
                          resultData.fidelity_score >= 4
                            ? "linear-gradient(90deg, #4ade80, #86efac)"
                            : resultData.fidelity_score >= 2.5
                            ? "linear-gradient(90deg, #FFB347, #FFD580)"
                            : "linear-gradient(90deg, #f87171, #fca5a5)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pros / Cons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div
                  style={{
                    background: "rgba(74,222,128,0.05)",
                    border: "1px solid rgba(74,222,128,0.15)",
                    borderRadius: 14,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 10,
                    }}
                  >
                    <CheckCircle2 style={{ width: 14, height: 14, color: "#4ade80", flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        color: "#4ade80",
                        letterSpacing: "0.06em",
                      }}
                    >
                      REALIDAD POSITIVA
                    </span>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {resultData.positive_reality.map((pro, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 12,
                          color: "rgba(255,255,255,0.6)",
                          lineHeight: 1.5,
                          marginBottom: 6,
                          alignItems: "flex-start",
                        }}
                      >
                        <span style={{ color: "#4ade80", marginTop: 2, flexShrink: 0 }}>·</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    background: "rgba(248,113,113,0.05)",
                    border: "1px solid rgba(248,113,113,0.15)",
                    borderRadius: 14,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 10,
                    }}
                  >
                    <AlertTriangle style={{ width: 14, height: 14, color: "#f87171", flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        color: "#f87171",
                        letterSpacing: "0.06em",
                      }}
                    >
                      ALERTAS CRÍTICAS
                    </span>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {resultData.critical_alerts.map((con, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 12,
                          color: "rgba(255,255,255,0.6)",
                          lineHeight: 1.5,
                          marginBottom: 6,
                          alignItems: "flex-start",
                        }}
                      >
                        <span style={{ color: "#f87171", marginTop: 2, flexShrink: 0 }}>·</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verdict */}
              <div
                style={{
                  background: "rgba(255,107,43,0.06)",
                  border: "1px solid rgba(255,107,43,0.18)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <ShieldAlert
                  style={{ width: 18, height: 18, color: "#FF6B2B", flexShrink: 0, marginTop: 1 }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      color: "#FF6B2B",
                      letterSpacing: "0.1em",
                      marginBottom: 6,
                    }}
                  >
                    VEREDICTO IA
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {resultData.verdict}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStatus("idle")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                  padding: "6px 0 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                <RefreshCw style={{ width: 12, height: 12 }} />
                Reiniciar análisis
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
