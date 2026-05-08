import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { apiRecetas } from '../hooks/useApiRecetas';
import NavegacionInferior from '../components/NavegacionInferior';
import TarjetaReceta from '../components/TarjetaReceta';
import BarraBusqueda from '../components/BarraBusqueda';
import logo from '../resources/logo.png';

const RECETAS_POR_PAGINA = 20;

export default function PaginaInicio() {
  const { perfil, usuario } = useAuthStore();
  const navigate = useNavigate();

  const [todasLasRecetas, setTodasLasRecetas] = useState([]);
  const [recetasMostradas, setRecetasMostradas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  const observadorRef = useRef(null);
  const centinelRef = useRef(null);

  const nombreMostrado = perfil?.full_name || usuario?.email?.split('@')[0] || 'Usuario';
  const iniciales = nombreMostrado.charAt(0).toUpperCase();

  // Cargar todas las recetas al montar
  useEffect(() => {
    apiRecetas.obtenerDestacadas().then(datos => {
      setTodasLasRecetas(datos);
      setRecetasMostradas(datos.slice(0, RECETAS_POR_PAGINA));
      setCargando(false);
    });
  }, []);

  // Cargar más recetas cuando el centinela es visible (scroll infinito)
  const cargarMas = useCallback(() => {
    if (cargandoMas || recetasMostradas.length >= todasLasRecetas.length) return;
    setCargandoMas(true);
    setTimeout(() => {
      const siguiente = pagina + 1;
      const nuevas = todasLasRecetas.slice(0, siguiente * RECETAS_POR_PAGINA);
      setRecetasMostradas(nuevas);
      setPagina(siguiente);
      setCargandoMas(false);
    }, 300);
  }, [cargandoMas, pagina, todasLasRecetas, recetasMostradas.length]);

  // Intersection Observer para scroll infinito
  useEffect(() => {
    if (observadorRef.current) observadorRef.current.disconnect();
    observadorRef.current = new IntersectionObserver(
      (entradas) => { if (entradas[0].isIntersecting) cargarMas(); },
      { threshold: 0.1 }
    );
    if (centinelRef.current) observadorRef.current.observe(centinelRef.current);
    return () => observadorRef.current?.disconnect();
  }, [cargarMas]);

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FDF6ED' }}>

      {/* Cabecera */}
      <div
        style={{
          background: 'linear-gradient(135deg, #E8631A 0%, #cf4f10 60%, #b83e08 100%)',
          borderRadius: '0 0 2rem 2rem',
          boxShadow: '0 8px 32px rgba(232,99,26,0.25)',
        }}
        className="px-6 pt-8 pb-6"
      >
        {/* Fila superior: logo izquierda + avatar derecha */}
        <div className="max-w-5xl mx-auto flex items-center justify-between mb-5">
          {/* Logo grande a la izquierda */}
          <div className="flex items-center gap-3">
            <div
              style={{
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '1rem',
                padding: '6px',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              }}
            >
              <img src={logo} alt="COOCKIT" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <p
                className="font-extrabold tracking-wide leading-none"
                style={{ color: 'white', fontSize: '1.35rem', letterSpacing: '0.04em' }}
              >
                COOCKIT
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>
                Tu cocina, tus recetas
              </p>
            </div>
          </div>

          {/* Avatar perfil derecha */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-white font-semibold text-sm leading-none">{nombreMostrado}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>Ver perfil</p>
            </div>
            <button
              onClick={() => navigate('/perfil')}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.95)',
                color: '#E8631A',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {iniciales}
            </button>
          </div>
        </div>

        {/* Saludo */}
        <div className="max-w-5xl mx-auto mb-4">
          <h1 className="text-white font-bold text-xl leading-snug">
            Hola, {nombreMostrado} 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            ¿Qué receta te apetece hoy?
          </p>
        </div>

        {/* Barra de búsqueda decorativa */}
        <div
          onClick={() => setMostrarBusqueda(true)}
          style={{
            background: 'rgba(255,255,255,0.97)',
            borderRadius: '0.875rem',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            transition: 'box-shadow 0.2s',
            maxWidth: '72rem',
            margin: '0 auto',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.18)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
        >
          <svg style={{ width: '1rem', height: '1rem', color: '#E8631A', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
          </svg>
          <span style={{ color: '#b0856a', fontSize: '0.875rem' }}>Buscar receta...</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-bold text-lg"
            style={{ color: '#b85c1a' }}
          >
            Recetas destacadas
          </h2>
          {!cargando && (
            <span
              style={{
                fontSize: '0.72rem',
                color: '#c08060',
                background: 'rgba(255,255,255,0.85)',
                padding: '0.2rem 0.75rem',
                borderRadius: '999px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
                border: '1px solid rgba(232,99,26,0.15)',
              }}
            >
              {todasLasRecetas.length} recetas
            </span>
          )}
        </div>

        {/* Grid de recetas */}
        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse aspect-square"
                style={{
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(232,99,26,0.08) 100%)',
                  boxShadow: '0 2px 8px rgba(232,99,26,0.06)',
                }}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recetasMostradas.map(receta => (
                <TarjetaReceta key={receta.idMeal} receta={receta} />
              ))}
            </div>

            {/* Centinela para scroll infinito */}
            <div ref={centinelRef} className="flex justify-center py-6">
              {cargandoMas && (
                <div className="flex items-center gap-2" style={{ color: '#E8631A' }}>
                  <div
                    className="animate-spin"
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      borderRadius: '50%',
                      border: '2px solid #E8631A',
                      borderTopColor: 'transparent',
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#b85c1a' }}>Cargando más recetas...</span>
                </div>
              )}
              {!cargandoMas && recetasMostradas.length >= todasLasRecetas.length && todasLasRecetas.length > 0 && (
                <p style={{ fontSize: '0.75rem', color: '#c08060' }}>Has visto todas las recetas 🍽️</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Panel de búsqueda */}
      {mostrarBusqueda && <BarraBusqueda onCerrar={() => setMostrarBusqueda(false)} />}

      {/* Navegación inferior */}
      <NavegacionInferior onToggleBusqueda={() => setMostrarBusqueda(true)} />
    </div>
  );
}