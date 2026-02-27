const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// Ruta para ver el chat al abrir la web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de vigilancia para UptimeRobot (Mantiene el bot despierto)
app.get('/keep-alive', (req, res) => {
  res.send("Servidor médico activo y vigilado 24/7");
});

// Configuración de Gemini con tu llave proporcionada
const genAI = new GoogleGenerativeAI("AIzaSyD8sJ0bZHZDdFPUb-3jgjL784k4nwwHpgw");
app.post('/chat', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Eres un asistente médico virtual de triaje. Tu objetivo es ayudar a pacientes. Si mencionan síntomas graves como dolor de pecho intenso, dificultad para respirar o pérdida de conciencia, diles inmediatamente que llamen al 911 o emergencias. Para casos leves, ayuda con consejos básicos y sugiere agendar una cita."
    });

    const result = await model.generateContent(req.body.mensaje);
    const response = await result.response;
    res.json({ respuesta: response.text() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ respuesta: "Lo siento, tuve un problema con mi conexión. Intenta de nuevo." });
  }
});

// Encendido del servidor en Replit
app.listen(3000, '0.0.0.0', () => {
  console.log("✅ SERVIDOR LISTO Y VIGILADO EN PUERTO 3000");
});
