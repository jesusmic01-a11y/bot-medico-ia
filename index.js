const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// LLAVE DE GEMINI (Asegúrate de que sea una llave nueva creada con VPN si es posible)
const genAI = new GoogleGenerativeAI("AIzaSyD8sJ0bZHZDdFPUb-3jgjL784k4nwwHpgw");

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    // Forzamos el modelo 1.5-flash que es el más estable para conexiones internacionales
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: req.body.mensaje }] }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        }
    });

    const response = await result.response;
    const text = response.text();
    
    res.json({ respuesta: text });

  } catch (e) {
    console.error("DETALLE DEL ERROR:", e);
    
    // Si el error es de ubicación, te lo dirá aquí
    if (e.message.includes("location") || e.message.includes("supported")) {
        res.status(500).json({ 
            respuesta: "Google detectó tu ubicación en Venezuela. Activa un VPN en tu navegador y recarga la página." 
        });
    } else {
        res.status(500).json({ respuesta: "Error de conexión con Gemini: " + e.message });
    }
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor médico con Gemini activo`);
});
