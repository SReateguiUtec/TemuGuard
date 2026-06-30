import { useState, useEffect } from "react";
import {
  Package, Truck, Plane, MapPin, CheckCircle, AlertTriangle,
  ShieldCheck, Loader2, ArrowRight, Sparkles, Clock, BarChart3,
  Globe, ChevronRight,
} from "lucide-react";

interface TrackingAlertResponse {
  has_delay: boolean;
  alert_title: string;
  alert_message: string;
  severity: "low" | "medium" | "high";
  estimated_delay_days: number;
}

const TRACKING_STAGES = [
  { id: 1, title: "Pedido Confirmado", description: "El vendedor ha recibido tu pedido.", icon: Package, location: "Guangzhou, CN" },
  { id: 2, title: "En Preparación", description: "Tu paquete está siendo embalado en el almacén de origen.", icon: Package, location: "Guangzhou, CN" },
  { id: 3, title: "Tránsito Internacional", description: "El paquete ha salido del país de origen.", icon: Plane, location: "En vuelo" },
  { id: 4, title: "En Aduanas", description: "El paquete está en proceso de revisión aduanera.", icon: ShieldCheck, location: "Lima, PE" },
  { id: 5, title: "Centro Logístico Local", description: "El paquete ha llegado al centro de distribución.", icon: MapPin, location: "Lima, PE" },
  { id: 6, title: "En Reparto", description: "El mensajero está en camino a tu domicilio.", icon: Truck, location: "Lima, PE" },
  { id: 7, title: "Entregado", description: "El paquete ha sido entregado exitosamente.", icon: CheckCircle, location: "Destino final" },
];

const SEVERITY_CONFIG = {
  high: { border: "border-red-500/25", bg: "bg-red-500/8", text: "text-red-400", badge: "bg-red-500/15 text-red-400 border-red-500/20" },
  medium: { border: "border-yellow-500/25", bg: "bg-yellow-500/8", text: "text-yellow-400", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  low: { border: "border-orange-500/25", bg: "bg-orange-500/8", text: "text-orange-400", badge: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
};

export default function OrderTracking() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [alert, setAlert] = useState<TrackingAlertResponse | null>(null);
  const [loadingAlert, setLoadingAlert] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(true);

  useEffect(() => {
    if (!isDemoRunning) return;
    const timer = setInterval(() => {
      setCurrentStageIndex((prev) => {
        const next = prev + 1;
        if (next >= TRACKING_STAGES.length - 1) {
          setIsDemoRunning(false);
          return TRACKING_STAGES.length - 1;
        }
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [isDemoRunning]);

  useEffect(() => {
    if (currentStageIndex === 0 || currentStageIndex === TRACKING_STAGES.length - 1) {
      const id = setTimeout(() => setAlert(null), 0);
      return () => clearTimeout(id);
    }
    const fetchAlert = async () => {
      setLoadingAlert(true);
      try {
        const stage = TRACKING_STAGES[currentStageIndex];
        const res = await fetch("http://localhost:8000/api/tracking/predict-alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            current_status: stage.title,
            destination_city: "Lima, Perú",
            time_in_transit_days: currentStageIndex * 2,
          }),
        });
        if (!res.ok) throw new Error("Error fetching alert");
        setAlert(await res.json());
      } catch {
        setAlert({
          has_delay: false,
          alert_title: "Estado Normal",
          alert_message: "No se han detectado anomalías por el momento.",
          severity: "low",
          estimated_delay_days: 0,
        });
      } finally {
        setLoadingAlert(false);
      }
    };
    fetchAlert();
  }, [currentStageIndex]);

  const progressPercent = Math.round((currentStageIndex / (TRACKING_STAGES.length - 1)) * 100);
  const currentStage = TRACKING_STAGES[currentStageIndex];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">

      {/* ── Hero Status Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#131316]">
        {/* ambient gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(255,107,43,0.35) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-10 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">Seguimiento de pedido</span>
                {isDemoRunning && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-temu-orange opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-temu-orange" />
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                #{" "}
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #FF6B2B, #FFB347)" }}>
                  TM-982347209
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Guangzhou, CN → Lima, PE
              </p>
            </div>

            {/* Live status pill */}
            <div className="flex items-center gap-3">
              <div className="glass-bright rounded-xl px-4 py-3 text-center min-w-[100px]">
                <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Estado</p>
                <p className="text-sm font-bold text-white leading-tight">{currentStage.title}</p>
              </div>
              <div className="glass-bright rounded-xl px-4 py-3 text-center min-w-[80px]">
                <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Progreso</p>
                <p className="text-2xl font-black text-temu-orange leading-tight">{progressPercent}%</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Origen</span>
              <span>{currentStage.location}</span>
              <span>Destino</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: "linear-gradient(90deg, #FF6B2B, #FFB347)",
                  boxShadow: "0 0 12px rgba(255,107,43,0.6)",
                }}
              />
            </div>
            <div className="flex justify-between">
              {TRACKING_STAGES.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    idx <= currentStageIndex ? "bg-temu-orange" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left: Timeline (3/5) ── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-white/[0.06] bg-[#131316] overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-white/[0.04]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-temu-orange" />
                Línea de tiempo
              </h2>
            </div>

            <div className="p-6">
              <div className="relative">
                {/* Vertical track */}
                <div className="absolute left-8 top-8 bottom-8 w-px bg-white/[0.05]" />
                {/* Filled track */}
                <div
                  className="absolute left-8 top-8 w-px transition-all duration-1000 ease-out"
                  style={{
                    height: `calc((100% - 64px) * ${progressPercent / 100})`,
                    background: "linear-gradient(to bottom, #FF6B2B, rgba(255,107,43,0.1))",
                  }}
                />

                <div className="space-y-1">
                  {TRACKING_STAGES.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isFuture = idx > currentStageIndex;

                    return (
                      <div
                        key={stage.id}
                        className={`relative flex items-start gap-4 rounded-xl px-3 py-3 transition-all duration-500 ${
                          isCurrent
                            ? "bg-temu-orange/[0.06] border border-temu-orange/20"
                            : isCompleted
                            ? "hover:bg-white/[0.02]"
                            : ""
                        } ${isFuture ? "opacity-35" : "opacity-100"}`}
                      >
                        {/* Node */}
                        <div className="relative z-10 shrink-0 w-10 h-10 rounded-xl bg-[#131316]">
                          <div
                            className={`absolute inset-0 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                              isCurrent
                                ? "bg-temu-orange border-temu-orange text-white shadow-[0_0_20px_rgba(255,107,43,0.4)]"
                                : isCompleted
                                ? "bg-temu-orange/20 border-temu-orange/40 text-temu-orange"
                                : "bg-white/[0.03] border-white/[0.08] text-gray-600"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                            {isCurrent && (
                              <span className="absolute inset-0 rounded-xl animate-ping border border-temu-orange opacity-30" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3
                              className={`text-sm font-semibold leading-tight ${
                                isCurrent ? "text-temu-orange" : isCompleted ? "text-white" : "text-gray-600"
                              }`}
                            >
                              {stage.title}
                            </h3>
                            <span className="text-[10px] text-gray-600 shrink-0 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {stage.location}
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 leading-relaxed ${isCurrent ? "text-gray-300" : "text-gray-600"}`}>
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column (2/5) ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* AI Alert card */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#131316] flex-1 overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Alertas Predictivas</h3>
                  <p className="text-[10px] text-gray-500">Análisis IA en tiempo real</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs text-gray-500 leading-relaxed mb-5">
                Nuestra IA analiza clima, aduanas y tráfico local para anticipar retrasos antes de que ocurran.
              </p>

              {loadingAlert ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border border-indigo-500/20 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full animate-ping border border-indigo-500/20" />
                  </div>
                  <span className="text-xs text-gray-500 text-center">Analizando logística global...</span>
                </div>
              ) : alert ? (
                <div
                  className={`rounded-xl p-4 border transition-all duration-500 animate-in fade-in slide-in-from-right-3 ${
                    alert.has_delay
                      ? SEVERITY_CONFIG[alert.severity].border + " " + SEVERITY_CONFIG[alert.severity].bg
                      : "border-emerald-500/25 bg-emerald-500/[0.06]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alert.has_delay ? (
                      <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${SEVERITY_CONFIG[alert.severity].text}`} />
                    ) : (
                      <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold mb-1.5 ${alert.has_delay ? SEVERITY_CONFIG[alert.severity].text : "text-emerald-400"}`}>
                        {alert.alert_title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {alert.alert_message}
                      </p>
                      {alert.has_delay && alert.estimated_delay_days > 0 && (
                        <div className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full border text-[11px] font-bold ${SEVERITY_CONFIG[alert.severity].badge}`}>
                          <Clock className="w-3 h-3" />
                          ~{alert.estimated_delay_days} días de retraso
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01]">
                  <ShieldCheck className="w-6 h-6 text-gray-700" />
                  <span className="text-xs text-gray-600 text-center px-4 leading-relaxed">
                    Esperando actualización de estado para generar predicciones...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#131316] p-5">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-temu-orange inline-block" />
              Acciones Rápidas
            </h4>
            <div className="space-y-2">
              {[
                { label: "Contactar Vendedor", sub: "Tiempo de respuesta: ~24h" },
                { label: "Solicitar Reembolso", sub: "Por retraso prolongado" },
              ].map((action) => (
                <button
                  key={action.label}
                  disabled
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-left opacity-40 cursor-not-allowed group"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{action.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{action.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-700 mt-3 text-center">Funciones disponibles en versión final</p>
          </div>

          {/* Stats mini row */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Días en tránsito", value: `${currentStageIndex * 2}`, unit: "días" },
              { label: "Etapas completadas", value: `${currentStageIndex}`, unit: `/ ${TRACKING_STAGES.length}` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-[#131316] p-4 text-center">
                <p className="text-[10px] font-semibold tracking-wide text-gray-600 uppercase mb-1">{stat.label}</p>
                <p className="text-xl font-black text-white">
                  {stat.value}
                  <span className="text-xs font-normal text-gray-500 ml-1">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA bar ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#131316] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-temu-orange/10 border border-temu-orange/20 flex items-center justify-center">
            <Package className="w-4 h-4 text-temu-orange" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">¿Otro pedido que revisar?</p>
            <p className="text-xs text-gray-500">Analiza la calidad del producto con nuestro filtro IA</p>
          </div>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white/40 border border-white/[0.06] bg-white/[0.02] cursor-not-allowed"
        >
          Analizar producto
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
