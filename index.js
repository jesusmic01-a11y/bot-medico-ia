const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  const mensajeUsuario = req.body.mensaje;

  try {
    // OPCIÓN 1: IA Gratuita (Llama 3 vía una API pública)
    const response = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(mensajeUsuario)}&owner=Doctor&botname=AsistenteMedico`);
    
    if (response.data && response.data.response) {
      return res.json({ respuesta: response.data.response });
    }
    
    throw new Error("Fallo opción 1");

  } catch (e) {
    try {
      // OPCIÓN 2: IA de respaldo (SimSimi - Muy estable en Venezuela)
      const resFallback = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(mensajeUsuario)}&lc=es`);
      
      if (resFallback.data && resFallback.data.success) {
        return res.json({ respuesta: resFallback.data.success });
      }
      
      res.json({ respuesta: "Lo siento, mi conexión está lenta. ¿Puedes repetir?" });

    } catch (err) {
      res.json({ respuesta: "Error de conexión. Intenta escribir algo diferente." });
    }
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});
