const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const mensajesRecibidos = [];

// Ruta POST requerida por la rúbrica para el formulario
app.post('/api/contacto', (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({
      ok: false,
      error: 'Faltan campos obligatorios.'
    });
  }

  const nuevoRegistro = {
    id: Date.now(),
    nombre,
    correo,
    asunto: asunto || 'Consulta General',
    mensaje,
    fecha: new Date().toLocaleString()
  };

  mensajesRecibidos.push(nuevoRegistro);
  console.log('📥 Mensaje recibido en el servidor:', nuevoRegistro);

  res.status(201).json({
    ok: true,
    mensaje: '¡Mensaje recibido y procesado con éxito en el servidor!',
    data: nuevoRegistro
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});