import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv

# Cargar variables de entorno (como GEMINI_API_KEY)
load_dotenv()

app = FastAPI(title="Filtro Antiengaño API")

# Habilitar CORS para que el Frontend (puerto 5173) pueda conectarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DATOS (PYDANTIC) ---
class ReviewData(BaseModel):
    title: str
    content: str
    rating: int

class AnalyzeRequest(BaseModel):
    product_name: str
    images: list[str]
    reviews: list[ReviewData]

class AnalysisResult(BaseModel):
    fidelity_score: float = Field(description="Score de 1.0 a 5.0 sobre qué tan fiel es la publicidad del producto a la realidad. 5 es totalmente fiel, 1 es un engaño total.")
    positive_reality: list[str] = Field(description="Lista de 2 a 3 viñetas cortas con los pros reales y comprobables del producto según las reseñas.")
    critical_alerts: list[str] = Field(description="Lista de 2 a 3 viñetas cortas con banderas rojas o engaños descubiertos (ej: materiales falsos, funciones que no existen).")
    verdict: str = Field(description="Un párrafo ejecutivo y directo aconsejando al usuario si debe comprarlo o no.")

class TrackingAlertRequest(BaseModel):
    current_status: str
    destination_city: str
    time_in_transit_days: int

class PredictiveAlertResponse(BaseModel):
    has_delay: bool = Field(description="Indica si existe un riesgo de retraso.")
    alert_title: str = Field(description="Título corto de la alerta (ej: 'Retraso por Aduanas', 'Alerta Climática', 'Todo en orden').")
    alert_message: str = Field(description="Mensaje explicando la predicción. Máximo 2 oraciones.")
    severity: str = Field(description="Nivel de severidad: 'low', 'medium', 'high'.")
    estimated_delay_days: int = Field(description="Días de retraso estimado. 0 si no hay retraso.")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    order_id: str
    question: str
    history: list[ChatMessage] = []

class ChatResponse(BaseModel):
    answer: str = Field(description="Respuesta breve, empática y accionable para el usuario.")
    intent: str = Field(description="Intención detectada: tracking, delay, refund, return, product_quality, missing_item, other.")
    suggested_actions: list[str] = Field(description="Lista de 2 a 3 acciones concretas que el usuario puede tomar.")

class ClaimRequest(BaseModel):
    order_id: str
    reason: str
    product_condition: str
    user_description: str
    preferred_solution: str

class ClaimResponse(BaseModel):
    case_type: str = Field(description="Tipo de caso: devolución, reembolso, reemplazo, revisión manual.")
    priority: str = Field(description="Prioridad sugerida: baja, media o alta.")
    summary: str = Field(description="Resumen claro del reclamo en una oración.")
    evidence_needed: list[str] = Field(description="Evidencias que debería adjuntar el usuario.")
    next_steps: list[str] = Field(description="Pasos recomendados para resolver el caso.")
    message_to_support: str = Field(description="Mensaje listo para enviar a soporte o vendedor.")

# Inicializar cliente de Gemini (usará automáticamente la variable GEMINI_API_KEY)
try:
    client = genai.Client()
except Exception as e:
    client = None
    print(f"Advertencia: No se pudo inicializar Gemini. Error en la variable de entorno de Gemini: {e}")

@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_product(req: AnalyzeRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key no configurada en el servidor.")

    # Construir el contexto para la IA
    system_prompt = (
        "Actúa como un inspector de calidad de e-commerce implacable, experto en detectar greenwashing y publicidad engañosa (Temu, Amazon, etc). "
        "Tu objetivo es proteger al consumidor joven de bajos ingresos.\n"
        "Te daré el nombre del producto, URLs de imágenes promocionales y un bloque de reseñas reales de compradores.\n"
        "Compara las promesas con la realidad de las reseñas y extrae la verdad."
    )
    
    user_content = f"Producto: {req.product_name}\n"
    user_content += f"Imágenes promocionales: {', '.join(req.images)}\n\n"
    user_content += "RESEÑAS REALES:\n"
    for r in req.reviews:
        user_content += f"- [{r.rating} estrellas] {r.title}: {r.content}\n"

    models_to_try = ['gemini-2.5-flash']
    last_error = None

    for model_name in models_to_try:
        try:
            print(f"Intentando analizar con el modelo: {model_name}...")
            response = client.models.generate_content(
                model=model_name,
                contents=system_prompt + "\n\n" + user_content,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': AnalysisResult,
                    'temperature': 0.1, 
                },
            )
            print(f"¡Éxito con {model_name}!")
            return response.parsed
        except Exception as e:
            print(f"Falló {model_name}: {str(e)}")
            last_error = e
            continue
            
    # Si todos los modelos fallan:
    raise HTTPException(status_code=500, detail=f"Servidores de Google IA saturados. Intenta de nuevo. Detalles: {str(last_error)}")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Filtro Antiengaño Backend está corriendo."}

@app.post("/api/tracking/predict-alert", response_model=PredictiveAlertResponse)
async def predict_tracking_alert(req: TrackingAlertRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key no configurada en el servidor.")
        
    system_prompt = (
        "Eres un sistema avanzado de Inteligencia Artificial logística que monitorea envíos internacionales (ej. desde China hacia Latinoamérica). "
        "Basado en el estado actual del envío, genera una alerta predictiva sobre posibles retrasos de manera aleatoria pero realista "
        "(ej. clima severo, saturación en aduanas, problemas con transportista local, revisión de seguridad). "
        "A veces, genera un estado sin problemas (has_delay=false) si el paquete apenas empieza su viaje o todo va bien. "
        "Responde siempre estrictamente con el formato JSON solicitado."
    )
    
    user_content = (
        f"Estado actual: {req.current_status}\n"
        f"Ciudad destino: {req.destination_city}\n"
        f"Días en tránsito: {req.time_in_transit_days}"
    )
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=system_prompt + "\n\n" + user_content,
            config={
                'response_mime_type': 'application/json',
                'response_schema': PredictiveAlertResponse,
                'temperature': 0.7, # Más creatividad para alertas aleatorias
            },
        )
        return response.parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando alerta logística: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat_assistant(req: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key no configurada en el servidor.")

    simulated_context = (
        "CONTEXTO SIMULADO DEL PEDIDO:\n"
        f"Pedido: {req.order_id}\n"
        "Producto: Smartwatch FitPro X8\n"
        "Destino: Lima, Peru\n"
        "Estado actual: En aduanas de Lima\n"
        "Fecha estimada original: 24 de junio\n"
        "Nueva fecha estimada: 28 a 30 de junio\n"
        "Riesgo detectado: retraso moderado por revision aduanera y alta demanda logistica\n"
        "Politica simulada: si el pedido supera 7 dias de retraso, sugerir solicitud de compensacion o reembolso parcial. "
        "Si el producto llega danado, incompleto o distinto a la descripcion, pedir fotos, video de desempaque y etiqueta del paquete.\n"
    )

    recent_history = "\n".join(
        f"{m.role}: {m.content}" for m in req.history[-6:]
    )

    prompt = (
        "Eres TemuGuard, un asistente de postcompra para jovenes limeños que compran en Temu. "
        "Responde en espanol peruano neutro, con tono cercano, claro y tranquilizador. "
        "No inventes datos fuera del contexto simulado. Si falta informacion, pide un dato puntual. "
        "Tu objetivo es reducir ansiedad, explicar el estado del pedido y guiar reclamos/devoluciones. "
        "Responde estrictamente con el JSON solicitado.\n\n"
        f"{simulated_context}\n"
        f"HISTORIAL RECIENTE:\n{recent_history or 'Sin historial previo.'}\n\n"
        f"PREGUNTA DEL USUARIO: {req.question}"
    )

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': ChatResponse,
                'temperature': 0.35,
            },
        )
        return response.parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando respuesta del chatbot: {str(e)}")

@app.post("/api/claims/generate", response_model=ClaimResponse)
async def generate_claim(req: ClaimRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key no configurada en el servidor.")

    prompt = (
        "Eres un asistente de reclamos y devoluciones para un prototipo academico de TemuGuard. "
        "Trabajas con datos simulados, pero debes producir una guia realista, ordenada y facil de entender. "
        "Clasifica el caso, pide evidencia necesaria y redacta un mensaje breve para soporte. "
        "Prioriza reducir friccion postventa y ansiedad del usuario. Responde estrictamente con el JSON solicitado.\n\n"
        f"Pedido simulado: {req.order_id}\n"
        f"Motivo seleccionado: {req.reason}\n"
        f"Condicion del producto: {req.product_condition}\n"
        f"Descripcion del usuario: {req.user_description}\n"
        f"Solucion preferida: {req.preferred_solution}\n"
    )

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': ClaimResponse,
                'temperature': 0.25,
            },
        )
        return response.parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando asistente de reclamo: {str(e)}")
