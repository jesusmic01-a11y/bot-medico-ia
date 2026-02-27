const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// 1. TU LLAVE DE GEMINI (Ya la puse aquí)
const genAI = new GoogleGenerativeAI("AIzaSyD8sJ0bZHZDdFPUb-3jgjL784k4nwwHpgw");

// 2. SERVIR EL CHAT (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. PROCESAR EL CHAT
app.post('/chat', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(req.body.mensaje);
    const response = await result.response;
    res.json({ respuesta: response.text() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ respuesta: "Error: No pude conectar con la IA." });
  }
});

// 4. ENCENDIDO PARA RENDER (Usa el puerto dinámico)
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor médico funcionando en el puerto ${PORT}`);
});
