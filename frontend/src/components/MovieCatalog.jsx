export default function MovieCatalog({ peliculas, peliculaActiva, onSeleccionar }) {
  return (
    <section id="cartelera" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-white mb-2">Cartelera Interactiva</h2>
      <p className="text-slate-400 mb-8">Elige una película para cambiar la proyección en la sala 3D.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {peliculas.map((peli) => {
          const activa = peli.id === peliculaActiva.id;
          return (
            <div
              key={peli.id}
              onClick={() => onSeleccionar(peli)}
              className={`cursor-pointer rounded-xl p-6 border transition-all ${
                activa ? 'bg-slate-900 border-red-500 shadow-lg' : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white inline-block mb-4" style={{ backgroundColor: peli.color }}>
                {peli.genero}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{peli.titulo}</h3>
              <p className="text-sm text-slate-400 mb-6">{peli.sinopsis}</p>
              <button className={`w-full py-2.5 rounded-lg text-sm font-semibold ${activa ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                {activa ? 'Proyectando en Sala' : 'Seleccionar'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}