const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// Tu llave de Gemini
const genAI = new GoogleGenerativeAI("AIzaSyDNAPOruF3aszRV0xfyneTpSAG4m0S9hRY");

// Ruta para el chat
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de despertar
app.get('/keep-alive', (req, res) => res.send("OK"));

// Lógica de la IA corregida
app.post('/chat', async (req, res) => {
  try {
    // Usamos el modelo estable 1.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(req.body.mensaje);
    const response = await result.response;
    const text = response.text();
    
    res.json({ respuesta: text });
  } catch (e) {
    console.error("Error:", e);
    // Intento de respaldo con gemini-pro si el flash falla
    try {
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resPro = await modelPro.generateContent(req.body.mensaje);
        res.json({ respuesta: resPro.response.text() });
    } catch (e2) {
        res.status(500).json({ respuesta: "Error de conexión con Google AI. Intenta de nuevo." });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor en puerto ${PORT}`);
});
