import { useState } from 'react';

export default function ContactForm({ peliculaActiva }) {
  const [formData, setFormData] = useState({ nombre: '', correo: '', asunto: 'Reserva VIP', mensaje: '' });
  const [estado, setEstado] = useState({ cargando: false, exito: null, error: null });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado({ cargando: true, exito: null, error: null });

    // URL dinámica: usa la variable de entorno en producción o localhost por defecto si estás programando local
    const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://cine-3d-backend.onrender.com';

    try {
     const response = await fetch(`${API_URL}/contacto`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...formData,
   asunto: `${formData.asunto} - ${peliculaActiva?.titulo || 'General'}`
  })
});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setEstado({ cargando: false, exito: data.mensaje, error: null });
      setFormData({ nombre: '', correo: '', asunto: 'Reserva VIP', mensaje: '' });
    } catch (err) {
      setEstado({ cargando: false, exito: null, error: err.message || 'Error de conexión con el servidor.' });
    }
  };

  return (
    <section id="contacto" className="bg-slate-900/60 border-t border-slate-800 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Reserva tus Entradas</h2>
        <p className="text-slate-400 text-center mb-8">Conectado en tiempo real con la base de datos en Neon.</p>
        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-950 p-8 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
            <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Correo</label>
              <input type="email" name="correo" required value={formData.correo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
              <select name="asunto" value={formData.asunto} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none">
                <option value="Reserva VIP">Reserva VIP</option>
                <option value="General">Entrada General</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Mensaje / Asientos</label>
            <textarea name="mensaje" rows="3" required value={formData.mensaje} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"></textarea>
          </div>
          <button type="submit" disabled={estado.cargando} className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition">
            {estado.cargando ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
          {estado.exito && <div className="p-4 rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-300 text-sm">{estado.exito}</div>}
          {estado.error && <div className="p-4 rounded-lg bg-red-950 border border-red-600 text-red-300 text-sm">{estado.error}</div>}
        </form>
      </div>
    </section>
  );
}