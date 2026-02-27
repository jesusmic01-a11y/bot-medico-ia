const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// LLAVE DE GEMINI
const genAI = new GoogleGenerativeAI("AIzaSyD8sJ0bZHZDdFPUb-3jgjL784k4nwwHpgw");

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(req.body.mensaje);
    const response = await result.response;
    res.json({ respuesta: response.text() });
  } catch (e) {
    console.error(e);
    // Mensaje amigable si detecta el bloqueo de región
    res.status(500).json({ 
      respuesta: "Google AI no está disponible en tu región actual. Por favor, intenta usar un VPN conectado a EEUU." 
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en puerto ${PORT}`);
});
