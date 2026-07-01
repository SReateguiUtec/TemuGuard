import { useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Bot,
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader2,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  Send,
  Sparkles,
  UploadCloud,
  User,
} from "lucide-react";

interface ChatResponse {
  answer: string;
  intent: string;
  suggested_actions: string[];
}

interface ClaimResponse {
  case_type: string;
  priority: string;
  summary: string;
  evidence_needed: string[];
  next_steps: string[];
  message_to_support: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  actions?: string[];
  intent?: string;
}

const ORDER_ID = "TM-982347209";

const quickPrompts = [
  "¿Dónde está mi pedido?",
  "Mi pedido está demorando mucho",
  "Llegó incompleto, ¿qué hago?",
  "Quiero pedir devolución",
];

const reasons = [
  "Producto incompleto",
  "Producto dañado",
  "No coincide con la descripción",
  "Retraso prolongado",
  "Quiero devolverlo",
];

const conditions = [
  "Sin abrir",
  "Abierto, sin uso",
  "Usado una vez",
  "Dañado al recibirlo",
  "Falta una pieza",
];

const solutions = ["Reembolso", "Reemplazo", "Devolución", "Compensación", "Asesoría"];

function priorityClasses(priority: string) {
  const normalized = priority.toLowerCase();
  if (normalized.includes("alta")) return "border-red-500/25 bg-red-500/[0.08] text-red-300";
  if (normalized.includes("media")) return "border-yellow-500/25 bg-yellow-500/[0.08] text-yellow-300";
  return "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300";
}

export default function PostPurchaseAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hola, soy TemuGuard. Puedo ayudarte a entender el estado de tu pedido, preparar un reclamo o iniciar una devolución sin vueltas.",
      actions: ["Consultar estado", "Preparar reclamo", "Ver requisitos de devolución"],
      intent: "welcome",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const [reason, setReason] = useState(reasons[0]);
  const [condition, setCondition] = useState(conditions[0]);
  const [preferredSolution, setPreferredSolution] = useState(solutions[0]);
  const [description, setDescription] = useState(
    "El pedido llegó, pero el producto no coincide totalmente con lo prometido en la publicación."
  );
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimResult, setClaimResult] = useState<ClaimResponse | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);

  const sendQuestion = async (text?: string) => {
    const nextQuestion = (text ?? question).trim();
    if (!nextQuestion || chatLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: nextQuestion }];
    setMessages(nextMessages);
    setQuestion("");
    setChatLoading(true);
    setChatError("");

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: ORDER_ID,
          question: nextQuestion,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "No se pudo consultar al asistente IA.");
      }

      const data: ChatResponse = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          actions: data.suggested_actions,
          intent: data.intent,
        },
      ]);
    } catch (error: unknown) {
      setChatError(error instanceof Error ? error.message : "Error inesperado en el chat.");
    } finally {
      setChatLoading(false);
    }
  };

  const generateClaim = async () => {
    if (!description.trim() || claimLoading) return;
    setClaimLoading(true);
    setClaimError("");
    setClaimResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/claims/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: ORDER_ID,
          reason,
          product_condition: condition,
          user_description: description,
          preferred_solution: preferredSolution,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "No se pudo generar el reclamo.");
      }

      setClaimResult(await response.json());
    } catch (error: unknown) {
      setClaimError(error instanceof Error ? error.message : "Error inesperado generando reclamo.");
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#131316] p-6 sm:p-8">
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-temu-orange/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-temu-orange/10 text-temu-orange text-xs font-bold border border-temu-orange/20 mb-5">
              <Sparkles className="w-4 h-4" />
              Asistencia inteligente 24/7
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Chatbot y asistente de devoluciones
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Prototipo postventa para reducir incertidumbre: responde dudas del pedido, clasifica reclamos y genera pasos claros para devolución o reembolso.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <div className="glass-bright rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Pedido</p>
              <p className="text-white font-black">{ORDER_ID}</p>
            </div>
            <div className="glass-bright rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Estado</p>
              <p className="text-temu-orange font-black">En aduanas</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <section className="xl:col-span-3 rounded-3xl border border-white/[0.06] bg-[#131316] overflow-hidden min-h-[680px] flex flex-col">
          <div className="px-5 sm:px-6 py-5 border-b border-white/[0.05] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-white font-black">Chatbot con PNL</h2>
                <p className="text-xs text-gray-500">Respuestas generadas por IA para soporte postventa</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300 text-[11px] font-bold">
              <BadgeCheck className="w-3.5 h-3.5" />
              Activo
            </span>
          </div>

          <div className="p-5 sm:p-6 border-b border-white/[0.04]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendQuestion(prompt)}
                  disabled={chatLoading}
                  className="text-left rounded-2xl border border-white/[0.06] bg-white/[0.025] hover:border-temu-orange/30 hover:bg-temu-orange/[0.04] transition px-4 py-3 text-sm text-gray-300 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div key={`${message.role}-${index}`} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-indigo-300" />
                    </div>
                  )}
                  <div className={`max-w-[82%] ${isUser ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 border text-sm leading-relaxed ${
                        isUser
                          ? "bg-temu-orange text-white border-temu-orange/60 rounded-tr-md"
                          : "bg-white/[0.035] text-gray-300 border-white/[0.07] rounded-tl-md"
                      }`}
                    >
                      {message.content}
                    </div>
                    {!isUser && message.actions && message.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.actions.map((action) => (
                          <span key={action} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-400">
                            {action}
                          </span>
                        ))}
                      </div>
                    )}
                    {!isUser && message.intent && (
                      <p className="mt-1 text-[10px] text-gray-700 uppercase tracking-widest">Intent: {message.intent}</p>
                    )}
                  </div>
                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-temu-orange/15 border border-temu-orange/25 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-temu-orange" />
                    </div>
                  )}
                </div>
              );
            })}
            {chatLoading && (
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                TemuGuard está redactando una respuesta...
              </div>
            )}
            {chatError && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300 flex gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {chatError}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendQuestion();
            }}
            className="p-4 sm:p-5 border-t border-white/[0.05]"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-2 focus-within:border-temu-orange/40">
              <MessageCircle className="w-5 h-5 text-gray-600 ml-2 shrink-0" />
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Escribe una duda sobre tu pedido o devolución..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-600 min-w-0"
              />
              <button
                type="submit"
                disabled={chatLoading || !question.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-temu-orange text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-temu-hover transition"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </div>
          </form>
        </section>

        <section className="xl:col-span-2 rounded-3xl border border-white/[0.06] bg-[#131316] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-5 border-b border-white/[0.05]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-temu-orange/10 border border-temu-orange/20 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-temu-orange" />
              </div>
              <div>
                <h2 className="text-white font-black">Asistente de reclamos</h2>
                <p className="text-xs text-gray-500">Genera caso, evidencias y mensaje para soporte</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Completa el caso. La IA clasifica el problema y propone pasos para reducir la fricción postventa.
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Motivo</span>
                <select value={reason} onChange={(event) => setReason(event.target.value)} className="w-full rounded-2xl bg-white/[0.035] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-temu-orange/40">
                  {reasons.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Condición</span>
                <select value={condition} onChange={(event) => setCondition(event.target.value)} className="w-full rounded-2xl bg-white/[0.035] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-temu-orange/40">
                  {conditions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Solución preferida</span>
              <div className="grid grid-cols-2 gap-2">
                {solutions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPreferredSolution(item)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                      preferredSolution === item
                        ? "border-temu-orange/50 bg-temu-orange/15 text-temu-orange"
                        : "border-white/[0.07] bg-white/[0.025] text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </label>

            <label className="space-y-2 block">
              <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Descripción del problema</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="w-full rounded-2xl bg-white/[0.035] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-temu-orange/40 resize-none"
                placeholder="Ejemplo: llegó incompleto, no prende, vino dañado o no coincide con la foto..."
              />
            </label>

            <label className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-4 flex items-start gap-3 cursor-pointer hover:border-temu-orange/30 hover:bg-temu-orange/[0.035] transition">
              <UploadCloud className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-300">Evidencias del pedido</p>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Sube fotos, videos de desempaque o capturas del pedido para sustentar el reclamo.
                </p>
                <p className="text-[11px] text-temu-orange font-bold mt-3">Seleccionar archivos</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  className="hidden"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setEvidenceFiles(files);
                  }}
                />
                {evidenceFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {evidenceFiles.map((file) => (
                      <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2">
                        <span className="text-xs text-gray-400 truncate">{file.name}</span>
                        <span className="text-[10px] text-gray-600 shrink-0">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </label>

            <button
              onClick={generateClaim}
              disabled={claimLoading || !description.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-temu-orange to-yellow-500 text-white text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_12px_34px_rgba(255,107,43,0.25)] transition"
            >
              {claimLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generar reclamo con IA
            </button>

            {claimError && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300 flex gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {claimError}
              </div>
            )}

            {claimResult && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Caso generado</p>
                      <h3 className="text-white font-black capitalize">{claimResult.case_type}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-[11px] font-black capitalize ${priorityClasses(claimResult.priority)}`}>
                      {claimResult.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{claimResult.summary}</p>
                </div>

                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
                  <h4 className="text-sm font-black text-emerald-300 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    Evidencias necesarias
                  </h4>
                  <ul className="space-y-2">
                    {claimResult.evidence_needed.map((item) => (
                      <li key={item} className="text-xs text-gray-400 leading-relaxed flex gap-2">
                        <span className="text-emerald-300">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.04] p-4">
                  <h4 className="text-sm font-black text-indigo-300 flex items-center gap-2 mb-3">
                    <PackageCheck className="w-4 h-4" />
                    Próximos pasos
                  </h4>
                  <ol className="space-y-2">
                    {claimResult.next_steps.map((item, index) => (
                      <li key={item} className="text-xs text-gray-400 leading-relaxed flex gap-2">
                        <span className="text-indigo-300 font-black">{index + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-2xl border border-temu-orange/15 bg-temu-orange/[0.045] p-4">
                  <h4 className="text-sm font-black text-temu-orange flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4" />
                    Mensaje para soporte
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{claimResult.message_to_support}</p>
                </div>

                <button
                  onClick={() => setClaimResult(null)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] text-gray-500 text-sm font-bold hover:text-gray-300 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Crear otro caso
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
