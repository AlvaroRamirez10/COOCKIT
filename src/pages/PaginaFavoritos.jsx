import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavoritos } from '../context/favoritosContext';
import NavegacionInferior from '../components/NavegacionInferior';
import BarraBusqueda from '../components/BarraBusqueda';

export default function PaginaFavoritos() {
  const { favoritos, quitarFavorito } = useFavoritos();
  const navigate = useNavigate();
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5E6D3] pb-24">

      {/* Cabecera */}
      <div className="bg-[#E8631A] px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Heart className="text-white fill-white" size={24} />
          <h1 className="text-white font-bold text-xl">Mis Favoritos</h1>
          <span className="ml-auto bg-white/20 text-white text-sm px-3 py-1 rounded-full">
            {favoritos.length} recetas
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-6">
        {favoritos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart size={56} className="text-[#E8631A]/20 mb-4" />
            <p className="text-gray-500 text-lg font-medium">Aún no tienes favoritos</p>
            <p className="text-gray-400 text-sm mt-1">
              Pulsa el corazón en cualquier receta para guardarla aquí
            </p>
            <button
              onClick={() => navigate('/inicio')}
              className="mt-6 bg-[#E8631A] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#cf5515] transition shadow-md"
            >
              Explorar recetas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoritos.map(fav => (
              <div
                key={fav.meal_id}
                className="relative cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group"
                onClick={() => navigate(`/receta/${fav.meal_id}`)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={fav.meal_thumb}
                    alt={fav.meal_name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); quitarFavorito(fav.meal_id); }}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow"
                  >
                    <Heart size={16} className="fill-[#E8631A] text-[#E8631A]" />
                  </button>
                  {fav.meal_category && (
                    <span className="absolute bottom-2 left-2 bg-[#E8631A]/90 text-white text-xs px-2 py-0.5 rounded-full">
                      {fav.meal_category}
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold text-gray-800 truncate">{fav.meal_name}</p>
                  {fav.meal_area && <p className="text-xs text-gray-400">{fav.meal_area}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarBusqueda && <BarraBusqueda onCerrar={() => setMostrarBusqueda(false)} />}
      <NavegacionInferior onToggleBusqueda={() => setMostrarBusqueda(true)} />
    </div>
  );
}