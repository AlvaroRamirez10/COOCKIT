import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavoritos } from '../context/favoritosContext';
import { useState, useEffect, useRef } from 'react';
import { traducirTituloReceta, traducirTermino } from '../utils/traduccion';

export default function TarjetaReceta({ receta }) {
  const navigate = useNavigate();
  const { esFavorito, agregarFavorito, quitarFavorito } = useFavoritos();
  const favorito = esFavorito(receta.idMeal);

  const [titulo, setTitulo] = useState(receta.strMeal);
  const [categoria, setCategoria] = useState(receta.strCategory || '');
  const [area, setArea] = useState(receta.strArea || '');
  const cardRef = useRef(null);

  // Traduce cuando la tarjeta entra en pantalla (lazy para no saturar la API)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          traducirTituloReceta(receta.idMeal, receta.strMeal)
            .then(setTitulo).catch(() => {});
          if (receta.strCategory) {
            traducirTermino(receta.strCategory)
              .then(setCategoria).catch(() => {});
          }
          if (receta.strArea) {
            traducirTermino(receta.strArea)
              .then(setArea).catch(() => {});
          }
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [receta.idMeal, receta.strMeal, receta.strCategory, receta.strArea]);

  const alternarFavorito = (e) => {
    e.stopPropagation();
    favorito ? quitarFavorito(receta.idMeal) : agregarFavorito(receta);
  };

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/receta/${receta.idMeal}`)}
      className="relative cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={receta.strMealThumb}
          alt={titulo}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Botón favorito */}
        <button
          onClick={alternarFavorito}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow transition-all hover:scale-110"
        >
          <Heart
            size={16}
            className={favorito ? 'fill-[#E8631A] text-[#E8631A]' : 'text-gray-400'}
          />
        </button>
        {/* Etiqueta de categoría */}
        {categoria && (
          <span className="absolute bottom-2 left-2 bg-[#E8631A]/90 text-white text-xs px-2 py-0.5 rounded-full">
            {categoria}
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-sm font-semibold text-gray-800 truncate">{titulo}</p>
        {area && <p className="text-xs text-gray-400">{area}</p>}
      </div>
    </div>
  );
}