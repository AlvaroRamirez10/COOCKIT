// ─────────────────────────────────────────────
// PaginaLogin.jsx — Página de inicio de sesión
// Para cambiar el mensaje de error, busca setError() abajo.
// Para redirigir a otro sitio tras el login, cambia navigate('/inicio').
// Los colores de la marca están en el objeto style con #E8631A.
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import logo from '../resources/logo.png';

export default function PaginaLogin() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuthStore(); // Función de login definida en authStore.js

  // ── Estado del formulario ─────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');       // Mensaje de error visible al usuario
  const [cargando, setCargando] = useState(false);
  const [visible, setVisible] = useState(false); // Controla la animación de entrada

  // Animación de entrada: espera 100ms antes de mostrar el contenido
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ── Lógica del formulario ─────────────────────────────────────────────
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    const { error } = await iniciarSesion(email, contrasena);
    setCargando(false);
    if (error) {
      // Para personalizar el mensaje de error, cambia el texto aquí
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    } else {
      navigate('/inicio'); // Redirige tras login exitoso → cambia la ruta aquí
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center" style={{ background: '#FDF6ED' }}>

      {/* ── Fondo decorativo ─────────────────────────────────────────────
          Círculos y partículas animadas. Para quitarlos, borra este bloque. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #E8631A18 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 100%, #E8631A10 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, #E8631A0D 0%, transparent 60%)',
        }} />
        <div className="absolute rounded-full" style={{
          width: '500px', height: '500px',
          top: '-180px', right: '-150px',
          background: 'radial-gradient(circle, #E8631A22 0%, transparent 70%)',
          border: '1px solid #E8631A18',
          animation: 'floatA 8s ease-in-out infinite',
        }} />
        <div className="absolute rounded-full" style={{
          width: '350px', height: '350px',
          bottom: '-100px', left: '-100px',
          background: 'radial-gradient(circle, #ff6b2222 0%, transparent 70%)',
          border: '1px solid #E8631A15',
          animation: 'floatB 10s ease-in-out infinite',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, #E8631A08 80px, #E8631A08 81px)',
        }} />
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: `${3 + (i % 4)}px`,
            height: `${3 + (i % 4)}px`,
            background: `rgba(232, 99, 26, ${0.15 + (i % 5) * 0.07})`,
            top: `${10 + (i * 17) % 80}%`,
            left: `${5 + (i * 23) % 90}%`,
            animation: `floatC ${5 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }} />
        ))}
      </div>

      {/* ── Contenido principal ───────────────────────────────────────────
          Para cambiar el ancho máximo del formulario, modifica max-w-sm */}
      <div
        className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Logo */}
        <div className="relative mb-6 flex items-center justify-center" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.85)',
          transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
        }}>
          <div className="absolute rounded-full" style={{
            width: '160px', height: '160px',
            background: 'radial-gradient(circle, #E8631A20 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }} />
          <div className="absolute rounded-full" style={{
            width: '120px', height: '120px',
            background: 'radial-gradient(circle, #E8631A15 0%, transparent 70%)',
          }} />
          <img
            src={logo}
            alt="COOCKIT"
            className="relative z-10"
            style={{ width: '180px', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(232,99,26,0.4))' }}
          />
        </div>

        {/* ── Tarjeta del formulario ────────────────────────────────────
            Para cambiar el fondo de la tarjeta, modifica background abajo */}
        <div
          className="w-full rounded-3xl p-7"
          style={{
            background: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(232,99,26,0.15)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 40px rgba(232,99,26,0.08)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          {/* Para cambiar el título, modifica el texto aquí */}
          <h1 className="text-xl font-bold text-center mb-1" style={{ color: '#3d1a00' }}>Bienvenido de nuevo</h1>
          <p className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: '#b85c1a', opacity: 0.7 }}>Inicia sesión para continuar</p>

          <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
            {/* Campo email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'rgba(232,99,26,0.7)' }} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  background: '#fff',
                  border: '1px solid rgba(232,99,26,0.2)',
                  color: '#3d1a00',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#E8631A'}
                onBlur={e => e.target.style.borderColor = 'rgba(232,99,26,0.2)'}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-[#b85c1a]/30 transition-all"
              />
            </div>

            {/* Campo contraseña */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'rgba(232,99,26,0.7)' }} />
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
                style={{
                  background: '#fff',
                  border: '1px solid rgba(232,99,26,0.2)',
                  color: '#3d1a00',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#E8631A'}
                onBlur={e => e.target.style.borderColor = 'rgba(232,99,26,0.2)'}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-[#b85c1a]/30 transition-all"
              />
            </div>

            {/* Mensaje de error (solo visible si hay error) */}
            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

            {/* Botón de envío — para cambiar el texto modifica los strings aquí */}
            <button
              type="submit"
              disabled={cargando}
              className="relative w-full font-semibold py-3.5 rounded-xl overflow-hidden group mt-1"
              style={{
                background: 'linear-gradient(135deg, #E8631A 0%, #cf4f10 100%)',
                boxShadow: '0 8px 24px rgba(232,99,26,0.4)',
                color: 'white',
                letterSpacing: '0.04em',
                opacity: cargando ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #ff7a33 0%, #E8631A 100%)' }} />
              <span className="relative z-10">{cargando ? 'Cargando...' : 'Iniciar sesión'}</span>
            </button>
          </form>

          {/* Separador visual */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(232,99,26,0.3))' }} />
            <div className="w-1 h-1 rounded-full bg-[#E8631A] opacity-50" />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(232,99,26,0.3))' }} />
          </div>

          {/* Links de navegación — modifica los to="..." para cambiar destinos */}
          <div className="flex flex-col items-center gap-2">
            <Link to="/registro" className="text-sm font-medium" style={{ color: 'rgba(232,99,26,0.9)' }}
              onMouseEnter={e => e.target.style.color = '#E8631A'}
              onMouseLeave={e => e.target.style.color = 'rgba(232,99,26,0.9)'}
            >
              ¿No tienes cuenta? <span className="underline">Regístrate</span>
            </Link>
            {/* Para implementar recuperar contraseña, añade aquí un Link a una nueva página */}
            <span className="text-xs" style={{ color: 'rgba(184,92,26,0.5)' }}>
              ¿Olvidaste tu contraseña?
            </span>
          </div>
        </div>

        {/* Pie decorativo */}
        <div className="mt-8 flex items-center gap-2" style={{
          opacity: visible ? 0.3 : 0,
          transition: 'opacity 0.8s ease 0.9s',
        }}>
          <div className="w-1 h-1 rounded-full bg-[#E8631A]" />
          <p className="text-[#b85c1a]/50 text-xs tracking-widest uppercase font-light">Coockit · 2025</p>
          <div className="w-1 h-1 rounded-full bg-[#E8631A]" />
        </div>
      </div>

      {/* ── Animaciones CSS ───────────────────────────────────────────────
          Para modificar las animaciones del fondo, edita los keyframes aquí */}
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }
        @keyframes floatB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -15px) scale(1.03); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-12px); opacity: 0.9; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
