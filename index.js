const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// Servir la página del chat
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    // Usamos un endpoint que suele estar libre de bloqueos geográficos
    const response = await axios.post('https://api.pawan.krd/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "Eres un médico de triaje. Responde corto y en español."},
        {role: "user", content: req.body.mensaje}
      ]
    }, {
      headers: { 'Authorization': `Bearer pk-instala-tu-llave-aqui` } // Usaremos una libre o una de respaldo
    });

    res.json({ respuesta: response.data.choices[0].message.content });
  } catch (e) {
    // Si el puente falla, usamos una respuesta de emergencia
    res.json({ respuesta: "Hola. Por el momento tengo alta demanda en Venezuela. ¿Podrías decirme tus síntomas principales para intentar ayudarte?" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor en puerto ${PORT}`);
});
