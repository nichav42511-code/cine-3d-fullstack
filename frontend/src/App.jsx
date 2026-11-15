import { useState } from 'react';
import Navbar from './components/Navbar';
import Cinema3D from './components/Cinema3D';
import MovieCatalog from './components/MovieCatalog';
import ContactForm from './components/ContactForm';

const PELICULAS = [
  { id: 1, titulo: 'Horizonte Cuántico', genero: 'Ciencia Ficción', color: '#3b82f6', sinopsis: 'Viaje a través de un agujero de gusano.' },
  { id: 2, titulo: 'Neón en Tokio', genero: 'Cyberpunk', color: '#ec4899', sinopsis: 'Investigación en la metrópoli del futuro.' },
  { id: 3, titulo: 'Ecos del Abismo', genero: 'Suspenso', color: '#10b981', sinopsis: 'Misterio bajo el océano profundo.' }
];

export default function App() {
  const [peliculaActiva, setPeliculaActiva] = useState(PELICULAS[0]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <main>
        <Cinema3D peliculaActiva={peliculaActiva} />
        <MovieCatalog peliculas={PELICULAS} peliculaActiva={peliculaActiva} onSeleccionar={setPeliculaActiva} />
        <ContactForm peliculaActiva={peliculaActiva} />
      </main>
    </div>
  );
}