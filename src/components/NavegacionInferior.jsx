import { Search, Home, Plus, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavegacionInferior({ onToggleBusqueda }) {
  const navigate = useNavigate();
  const ubicacion = useLocation();

  const esActiva = (ruta) =>
    ubicacion.pathname === ruta
      ? 'text-[#E8631A]'
      : 'text-gray-400 hover:text-[#E8631A]';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-around py-3 px-6">

        <button
          onClick={onToggleBusqueda}
          className={`flex flex-col items-center gap-1 transition-colors ${esActiva('/buscar')}`}
        >
          <Search size={22} />
          <span className="text-xs">Buscar</span>
        </button>

        <button
          onClick={() => navigate('/inicio')}
          className={`flex flex-col items-center gap-1 transition-colors ${esActiva('/inicio')}`}
        >
          <Home size={22} />
          <span className="text-xs">Inicio</span>
        </button>

        <button
          onClick={() => navigate('/lista-compra')}
          className={`flex flex-col items-center gap-1 transition-colors ${esActiva('/lista-compra')}`}
        >
          <div className={`rounded-full p-2 ${ubicacion.pathname === '/lista-compra' ? 'bg-[#cf4f10]' : 'bg-[#E8631A]'}`}>
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-xs">Lista</span>
        </button>

        <button
          onClick={() => navigate('/favoritos')}
          className={`flex flex-col items-center gap-1 transition-colors ${esActiva('/favoritos')}`}
        >
          <Heart size={22} />
          <span className="text-xs">Favoritos</span>
        </button>

        <button
          onClick={() => navigate('/perfil')}
          className={`flex flex-col items-center gap-1 transition-colors ${esActiva('/perfil')}`}
        >
          <User size={22} />
          <span className="text-xs">Perfil</span>
        </button>

      </div>
    </div>
  );
}