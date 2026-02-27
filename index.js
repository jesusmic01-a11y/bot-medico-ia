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

// Este es un motor de búsqueda que permite usar IA gratis sin llaves
app.post('/chat', async (req, res) => {
  try {
    const response = await axios.post('https://api.duckduckgo.com/tiv', {
      model: "gpt-4o-mini", // O un modelo compatible
      messages: [
        {role: "system", content: "Eres un médico. Responde corto."},
        {role: "user", content: req.body.mensaje}
      ]
    });
    
    res.json({ respuesta: response.data.choices[0].message.content });
  } catch (e) {
    // Si falla el anterior, usaremos un servidor de prueba de inteligencia artificial libre
    try {
        const fallback = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(req.body.mensaje)}&lc=es`);
        res.json({ respuesta: fallback.data.success });
    } catch (err) {
        res.json({ respuesta: "Lo siento, la conexión con el cerebro de la IA está inestable. ¿Podrías intentar de nuevo?" });
    }
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor activo`);
});
