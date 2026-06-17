# <img src="./frontend/public/favicon.svg" width="40" align="top" /> Temu Filter

**Filtro Antiengaño IA** es un prototipo interactivo impulsado por Inteligencia Artificial diseñado para analizar la veracidad de los productos en plataformas de e-commerce. A través del análisis de múltiples fuentes de datos (imágenes del producto, descripciones y decenas de reseñas de usuarios reales), la aplicación detecta inconsistencias, publicidad engañosa (*greenwashing*) y evalúa si la calidad real coincide con las expectativas del marketing.

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

1. En la página de inicio verás 3 productos de ejemplo pre-cargados (un reloj inteligente, unas zapatillas y un set de cuchillos).
2. Al hacer clic en cualquiera de ellos, ingresarás al Dashboard del producto donde verás su precio, fotos y reseñas sin procesar.
3. Haz clic en el botón naranja **"Analizar"**. El frontend enviará las fotos y el texto de las reseñas al Backend.
4. El Backend se conecta con **Gemini Flash** utilizando un sistema de contingencia (Fallback automático entre los modelos 3.5, 3.1, 2.5 y 1.5 en caso de sobrecarga del servidor de Google).
5. En unos segundos, recibirás el veredicto final: Puntaje de fidelidad, Realidad vs Publicidad, Alertas Rojas críticas, y un resumen ejecutivo.

---

**Creado para revolucionar la forma en que compramos por internet.**
