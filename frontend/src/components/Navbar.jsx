export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
          <span className="text-xl font-bold tracking-wider text-white">
            CINE<span className="text-red-500">VERSE</span> 3D
          </span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-300">
          <a href="#sala-3d" className="hover:text-white transition">Sala 3D</a>
          <a href="#cartelera" className="hover:text-white transition">Cartelera</a>
          <a href="#contacto" className="hover:text-white transition">Contacto</a>
        </div>
      </div>
    </nav>
  );
}