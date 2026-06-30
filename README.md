# <img src="./frontend/public/favicon.svg" width="40" align="top" /> TemuGuard

**TemuGuard** es una plataforma integral de compras inteligentes impulsada por Inteligencia Artificial. Actúa como un **filtro anti-engaños** para revelar la calidad real de los productos y como un **rastreador logístico avanzado** con alertas predictivas para tus envíos.

A través del análisis de múltiples fuentes de datos (imágenes, descripciones y decenas de reseñas reales), la IA detecta inconsistencias y publicidad engañosa. Simultáneamente, el módulo de seguimiento analiza factores externos (aduanas, clima, tiempos de tránsito) para predecir y alertar sobre posibles retrasos antes de que ocurran.

## 🚀 Arquitectura del Proyecto

El proyecto está dividido en dos partes principales:

1. **Frontend (React + Vite + Tailwind V4):** Una interfaz de usuario moderna, rápida y "premium", con diseño responsivo y animaciones fluidas para presentar los hallazgos de la IA.
2. **Backend (Python + FastAPI):** Un servidor asíncrono súper rápido que se conecta con la API de Google Gemini (Multimodal) usando esquemas estrictos (`Pydantic`) para devolver respuestas garantizadas en formato JSON estructurado.

---

## 🛠 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
* **Node.js** (v18 o superior)
* **Python** (v3.10 o superior)
* Una clave API válida de [Google AI Studio (Gemini)](https://aistudio.google.com/)

---

## ⚙️ Instalación y Configuración

### 1. Configuración del Backend

Abre una terminal y navega a la carpeta del backend:

```bash
cd backend
```

Crea un entorno virtual para aislar las dependencias de Python:
```bash
python3 -m venv venv
```

Activa el entorno virtual:
* **En macOS/Linux:** `source venv/bin/activate`
* **En Windows:** `venv\Scripts\activate`

Instala las librerías necesarias:
```bash
pip install -r requirements.txt
```

**Configuración de la IA:**
Renombra el archivo `.env.example` a `.env` (o crea uno nuevo) dentro de la carpeta `backend/` y coloca tu clave de Gemini:
```env
GEMINI_API_KEY="AIzaSyTuClaveSecretaAqui..."
```

### 2. Configuración del Frontend

Abre **otra** terminal y navega a la carpeta del frontend:

```bash
cd frontend
```

Instala las dependencias de Node:
```bash
npm install
```

---

## ▶️ Ejecución del Proyecto (Desarrollo Local)

Para que la aplicación funcione, necesitas levantar ambos servidores simultáneamente (el backend en una terminal y el frontend en otra).

### Iniciar el Servidor Backend
En tu terminal del backend (asegúrate de que el entorno virtual `venv` siga activado):
```bash
uvicorn main:app --reload
```
*El backend quedará escuchando en `http://localhost:8000`.*

### Iniciar el Servidor Frontend
En tu terminal del frontend:
```bash
npm run dev
```
*El frontend se abrirá normalmente en `http://localhost:5173`. ¡Abre esa URL en tu navegador!*

---

## 💡 Cómo funciona la Demo

1. En la página de inicio, puedes explorar las dos grandes funcionalidades: el análisis de productos y el seguimiento de pedidos.
2. **Análisis de Producto (Anti-engaño):** Al hacer clic en cualquiera de las tarjetas de productos, ingresarás a su Dashboard. Haz clic en el botón **"Analizar"** para que la IA evalúe las fotos y el texto de las reseñas. En segundos recibirás el veredicto final: Puntaje de fidelidad, Realidad vs Publicidad y Alertas críticas.
3. **Seguimiento Logístico (Order Tracking):** Haz clic en "Mis Pedidos" en la barra de navegación para ver la línea de tiempo de un envío internacional (ej. Guangzhou a Lima). En cada etapa, la IA genera alertas predictivas sobre posibles demoras.
4. El Backend está robustecido con un sistema de contingencia (Fallback automático entre varios modelos Gemini) para garantizar que la aplicación siempre responda.
