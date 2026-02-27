const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();

// CONFIGURACIÓN DE SEGURIDAD Y PUERTO
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 1. RUTA PRINCIPAL (Carga tu HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. RUTA DE VIGILANCIA
app.get('/keep-alive', (req, res) => {
  res.send("Servidor Activo");
});

// 3. LOGICA DE LA IA (Tu llave ya está aquí)
const genAI = new GoogleGenerativeAI("AIzaSyD8sJ0bZHZDdFPUb-3jgjL784k4nwwHpgw");

app.post('/chat', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(req.body.mensaje);
    const response = await result.response;
    res.json({ respuesta: response.text() });
  } catch (e) {
    console.error("Error detallado:", e);
    res.status(500).json({ respuesta: "Error en la IA: " + e.message });
  }
});

// 4. EL PUERTO DINÁMICO (Crucial para Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor funcionando en puerto ${PORT}`);
});
