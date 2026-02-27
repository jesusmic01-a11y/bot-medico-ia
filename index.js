const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos (como el HTML)
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Puerto compatible con Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Sistema de Ambulancias activo en puerto ${PORT}`);
});
