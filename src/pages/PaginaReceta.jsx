import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, ChefHat, Globe, CalendarDays, X } from 'lucide-react';
import { apiRecetas } from '../hooks/useApiRecetas';
import { traducirRecetaCompleta } from '../utils/traduccion';
import { useFavoritos } from '../context/favoritosContext';
import { useListaCompra } from '../context/listaCompraContext';
import { usePlanificador } from '../context/planificadorContext';
import NavegacionInferior from '../components/NavegacionInferior';
import BarraBusqueda from '../components/BarraBusqueda';

export default function PaginaReceta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { esFavorito, agregarFavorito, quitarFavorito } = useFavoritos();
  const { agregarDesdeReceta } = useListaCompra();
  const { diasSemana, planificarReceta } = usePlanificador();
  const [receta, setReceta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [traduciendo, setTraduciendo] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [mensajeLista, setMensajeLista] = useState('');
  const [mostrarPlanificador, setMostrarPlanificador] = useState(false);
  const [diaPlan, setDiaPlan] = useState('Lunes');
  const [tipoPlan, setTipoPlan] = useState('comida');

  useEffect(() => {
    apiRecetas.obtenerPorId(id).then(async datos => {
      setReceta(datos);
      setCargando(false);
      setTraduciendo(true);
      try {
        const traducida = await traducirRecetaCompleta(datos);
        setReceta(traducida);
      } catch { /* si falla la traducción se mantiene el original en inglés */ }
      setTraduciendo(false);
    });
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8631A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!receta) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <p className="text-gray-500">Receta no encontrada.</p>
      </div>
    );
  }

  const favorito = esFavorito(receta.idMeal);

  // Extraer ingredientes
  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    const ingrediente = receta[`strIngredient${i}`];
    const cantidad = receta[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim()) {
      ingredientes.push({ ingrediente, cantidad: cantidad?.trim() || '' });
    }
  }

  // Extraer pasos de instrucciones
  const pasos = receta.strInstructions
    ? receta.strInstructions.split(/\r\n|\n|\r/).filter(p => p.trim().length > 0)
    : [];

  const agregarIngredientesALista = () => {
    const { agregados, actualizados } = agregarDesdeReceta(receta);
    if (agregados > 0 && actualizados > 0) {
      setMensajeLista(`Añadidos ${agregados} y actualizados ${actualizados} ingredientes`);
    } else if (agregados > 0) {
      setMensajeLista(`Se añadieron ${agregados} ingredientes a tu lista`);
    } else if (actualizados > 0) {
      setMensajeLista(`Se actualizaron ${actualizados} ingredientes que ya tenías`);
    } else {
      setMensajeLista('No se encontraron ingredientes válidos para añadir');
    }
    setTimeout(() => setMensajeLista(''), 2200);
  };

  const abrirPlanificador = () => {
    setDiaPlan(diasSemana[0]);
    setTipoPlan('comida');
    setMostrarPlanificador(true);
  };

  const confirmarPlan = () => {
    planificarReceta({ dia: diaPlan, tipo: tipoPlan, receta });
    setMostrarPlanificador(false);
    setMensajeLista(`Receta planificada para ${diaPlan} (${tipoPlan})`);
    setTimeout(() => setMensajeLista(''), 2200);
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] pb-24">

      {/* Imagen principal */}
      <div className="relative">
        <img
          src={receta.strMealThumb}
          alt={receta.strMeal}
          className="w-full h-72 object-cover"
        />
        {/* Degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-md hover:bg-white transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>

        {/* Botón favorito */}
        <button
          onClick={() => favorito ? quitarFavorito(receta.idMeal) : agregarFavorito(receta)}
          className="absolute top-5 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-md hover:bg-white transition"
        >
          <Heart size={20} className={favorito ? 'fill-[#E8631A] text-[#E8631A]' : 'text-gray-500'} />
        </button>

        {/* Título sobre la imagen */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-white text-2xl font-bold drop-shadow-lg">{receta.strMeal}</h1>
          {traduciendo && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-3 h-3 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
              <span className="text-white/70 text-xs">Traduciendo al español...</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-6">

        {/* Etiquetas informativas */}
        <div className="flex flex-wrap gap-2 mb-6">
          {receta.strCategory && (
            <span className="flex items-center gap-1 bg-[#E8631A]/10 text-[#E8631A] text-sm px-3 py-1 rounded-full font-medium">
              <ChefHat size={14} /> {receta.strCategory}
            </span>
          )}
          {receta.strArea && (
            <span className="flex items-center gap-1 bg-white text-gray-600 text-sm px-3 py-1 rounded-full shadow font-medium">
              <Globe size={14} /> {receta.strArea}
            </span>
          )}
          <span className="flex items-center gap-1 bg-white text-gray-600 text-sm px-3 py-1 rounded-full shadow font-medium">
            <Clock size={14} /> 30 min
          </span>
          <span className="flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
            Fácil
          </span>
        </div>

        {/* Ingredientes */}
        <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <h2 className="font-bold text-gray-800 text-lg mb-4">Ingredientes</h2>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={agregarIngredientesALista}
              className="w-full sm:w-auto bg-[#E8631A] hover:bg-[#cf4f10] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition"
            >
              Añadir ingredientes a mi lista
            </button>
            <button
              onClick={abrirPlanificador}
              className="w-full sm:w-auto bg-white border border-[#E8631A]/30 text-[#b85c1a] hover:bg-[#fff6ee] text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <CalendarDays size={15} /> Planificar esta receta
            </button>
          </div>
          {mensajeLista && (
            <div className="mb-4 text-xs bg-[#fff3e9] border border-[#f4c9a8] text-[#b85c1a] px-3 py-2 rounded-lg">
              {mensajeLista}
            </div>
          )}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ingredientes.map(({ ingrediente, cantidad }, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full bg-[#E8631A] flex-shrink-0" />
                <span className="font-medium">{cantidad}</span>
                <span className="text-gray-500">{ingrediente}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 text-lg mb-4">Instrucciones</h2>
          <ol className="flex flex-col gap-4">
            {pasos.map((paso, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E8631A] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">{paso}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Enlace a YouTube */}
        {receta.strYoutube && (
          <a
            href={receta.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition shadow-md"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Ver en YouTube
          </a>
        )}
      </div>

      {mostrarBusqueda && <BarraBusqueda onCerrar={() => setMostrarBusqueda(false)} />}

      {mostrarPlanificador && (
        <div
          className="fixed inset-0 z-50 bg-black/35 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setMostrarPlanificador(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#3d1a00]">Planificar receta</h3>
              <button onClick={() => setMostrarPlanificador(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <label className="block mb-3">
              <span className="text-xs font-semibold text-[#b85c1a]">Dia</span>
              <select
                value={diaPlan}
                onChange={(e) => setDiaPlan(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#ead7c5] px-3 py-2 text-sm outline-none"
              >
                {diasSemana.map((dia) => <option key={dia} value={dia}>{dia}</option>)}
              </select>
            </label>

            <label className="block mb-4">
              <span className="text-xs font-semibold text-[#b85c1a]">Momento</span>
              <select
                value={tipoPlan}
                onChange={(e) => setTipoPlan(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#ead7c5] px-3 py-2 text-sm outline-none"
              >
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
              </select>
            </label>

            <button
              onClick={confirmarPlan}
              className="w-full bg-[#E8631A] hover:bg-[#cf4f10] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              Guardar en planificador
            </button>
          </div>
        </div>
      )}

      <NavegacionInferior onToggleBusqueda={() => setMostrarBusqueda(true)} />
    </div>
  );
}