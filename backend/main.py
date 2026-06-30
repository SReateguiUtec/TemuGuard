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
