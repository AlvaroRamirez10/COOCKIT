import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/authContext';
import logo from '../resources/logo.png';

export default function PaginaRegistro() {
  const navigate = useNavigate();
  const { registrarse } = useAuth();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setCargando(true);
    const { error } = await registrarse(email, contrasena, nombreCompleto);
    setCargando(false);
    if (error) {
      setError(error.message || 'Error al crear la cuenta.');
    } else {
      navigate('/inicio');
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(232,99,26,0.3)',
    color: 'white',
    outline: 'none',
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center" style={{ background: '#2d1200' }}>

      {/* ── Fondo decorativo ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #E8631A30 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 100%, #b8420a22 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, #ff8c4220 0%, transparent 60%)',
        }} />
        <div className="absolute rounded-full" style={{
          width: '500px', height: '500px',
          top: '-180px', right: '-150px',
          background: 'radial-gradient(circle, #E8631A1A 0%, transparent 70%)',
          border: '1px solid #E8631A14',
          animation: 'floatA 8s ease-in-out infinite',
        }} />
        <div className="absolute rounded-full" style={{
          width: '350px', height: '350px',
          bottom: '-100px', left: '-100px',
          background: 'radial-gradient(circle, #ff6b221A 0%, transparent 70%)',
          border: '1px solid #E8631A12',
          animation: 'floatB 10s ease-in-out infinite',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, #E8631A06 80px, #E8631A06 81px)',
        }} />
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: `${3 + (i % 4)}px`,
            height: `${3 + (i % 4)}px`,
            background: `rgba(232, 99, 26, ${0.12 + (i % 5) * 0.06})`,
            top: `${10 + (i * 17) % 80}%`,
            left: `${5 + (i * 23) % 90}%`,
            animation: `floatC ${5 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }} />
        ))}
      </div>

      {/* ── Contenido ── */}
      <div
        className="relative z-10 w-full max-w-sm mx-auto px-6 py-8 flex flex-col items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Logo con halo */}
        <div className="relative mb-5 flex items-center justify-center" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.85)',
          transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
        }}>
          <div className="absolute rounded-full" style={{
            width: '150px', height: '150px',
            background: 'radial-gradient(circle, #E8631A1A 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }} />
          <img
            src={logo}
            alt="COOCKIT"
            className="relative z-10"
            style={{ width: '160px', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(232,99,26,0.35))' }}
          />
        </div>

        {/* Avatar con inicial */}
        <div className="mb-4" style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.2s',
        }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #E8631A 0%, #cf4f10 100%)',
              boxShadow: '0 4px 16px rgba(232,99,26,0.4)',
              color: 'white',
            }}>
            {nombreCompleto ? nombreCompleto.charAt(0).toUpperCase() : '?'}
          </div>
        </div>

        {/* Tarjeta del formulario */}
        <div
          className="w-full rounded-3xl p-7"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(232,99,26,0.2)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <h1 className="text-xl font-bold text-white text-center mb-1">Crea tu cuenta</h1>
          <p className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: 'rgba(232,99,26,0.7)' }}>
            Únete y descubre recetas increíbles
          </p>

          <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
            {/* Nombre */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'rgba(232,99,26,0.7)' }} />
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombreCompleto}
                onChange={e => setNombreCompleto(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#E8631A'}
                onBlur={e => e.target.style.borderColor = 'rgba(232,99,26,0.3)'}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-white/30 transition-all"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'rgba(232,99,26,0.7)' }} />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#E8631A'}
                onBlur={e => e.target.style.borderColor = 'rgba(232,99,26,0.3)'}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-white/30 transition-all"
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'rgba(232,99,26,0.7)' }} />
              <input
                type="password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#E8631A'}
                onBlur={e => e.target.style.borderColor = 'rgba(232,99,26,0.3)'}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-white/30 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

            {/* Botón principal */}
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
              <span className="relative z-10">{cargando ? 'Creando cuenta...' : 'Crear cuenta'}</span>
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(232,99,26,0.3))' }} />
            <div className="w-1 h-1 rounded-full bg-[#E8631A] opacity-50" />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(232,99,26,0.3))' }} />
          </div>

          {/* Link */}
          <div className="flex justify-center">
            <Link to="/login" className="text-sm font-medium" style={{ color: 'rgba(232,99,26,0.9)' }}
              onMouseEnter={e => e.target.style.color = '#E8631A'}
              onMouseLeave={e => e.target.style.color = 'rgba(232,99,26,0.9)'}
            >
              ¿Ya tienes cuenta? <span className="underline">Inicia sesión</span>
            </Link>
          </div>
        </div>

        {/* Pie decorativo */}
        <div className="mt-6 flex items-center gap-2" style={{
          opacity: visible ? 0.3 : 0,
          transition: 'opacity 0.8s ease 0.9s',
        }}>
          <div className="w-1 h-1 rounded-full bg-[#E8631A]" />
          <p className="text-white/50 text-xs tracking-widest uppercase font-light">Coockit · 2025</p>
          <div className="w-1 h-1 rounded-full bg-[#E8631A]" />
        </div>
      </div>

      {/* ── Keyframes ── */}
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