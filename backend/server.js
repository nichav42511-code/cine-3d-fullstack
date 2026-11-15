const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL (Neon)
// Render y Neon inyectarán la URL automáticamente a través de process.env.DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Crear la tabla de contactos automáticamente si no existe al iniciar el servidor
pool.query(`
  CREATE TABLE IF NOT EXISTS contactos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    asunto VARCHAR(150),
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => {
  console.log("📦 Tabla 'contactos' verificada/creada en Neon con éxito.");
}).catch(err => {
  console.error("Error al crear la tabla en la base de datos:", err);
});

// Ruta POST requerida por la rúbrica para el formulario
app.post('/api/contacto', async (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({
      ok: false,
      error: 'Faltan campos obligatorios.'
    });
  }

  try {
    const query = `
      INSERT INTO contactos (nombre, correo, asunto, mensaje)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nombre, correo, asunto || 'Consulta General', mensaje];
    
    const nuevoRegistro = await pool.query(query, values);

    console.log('📥 Mensaje guardado en Neon:', nuevoRegistro.rows[0]);

    res.status(201).json({
      ok: true,
      mensaje: '¡Mensaje recibido, procesado y guardado en la base de datos con éxito!',
      data: nuevoRegistro.rows[0]
    });
  } catch (error) {
    console.error('Error al guardar en la base de datos:', error);
    res.status(500).json({
      ok: false,
      error: 'Error interno del servidor al guardar el mensaje.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});