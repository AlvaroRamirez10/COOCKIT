import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../resources/logo.png';

export default function PaginaInicial() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
 
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);
 
  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center" style={{ background: '#FDF6ED' }}>
 
      {/* ── Fondo con capas de gradientes y círculos decorativos ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
 
        {/* Gradiente base cálido */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #E8631A18 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 100%, #E8631A10 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, #E8631A0D 0%, transparent 60%)',
        }} />
 
        {/* Círculo grande superior derecha */}
        <div className="absolute rounded-full" style={{
          width: '500px', height: '500px',
          top: '-180px', right: '-150px',
          background: 'radial-gradient(circle, #E8631A22 0%, transparent 70%)',
          border: '1px solid #E8631A18',
          animation: 'floatA 8s ease-in-out infinite',
        }} />
 
        {/* Círculo mediano inferior izquierda */}
        <div className="absolute rounded-full" style={{
          width: '350px', height: '350px',
          bottom: '-100px', left: '-100px',
          background: 'radial-gradient(circle, #ff6b2222 0%, transparent 70%)',
          border: '1px solid #E8631A15',
          animation: 'floatB 10s ease-in-out infinite',
        }} />
 
        {/* Líneas decorativas diagonales */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, #E8631A08 80px, #E8631A08 81px)',
        }} />
 
        {/* Puntos decorativos flotantes */}
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
 
      {/* ── Contenido principal ── */}
      <div
        className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
 
        {/* Logo con halo pulsante */}
        <div className="relative mb-8 flex items-center justify-center" style={{
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
            style={{ width: '200px', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(232,99,26,0.4))' }}
          />
        </div>
 
        {/* Eslogan */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
        }} className="text-center mb-3">
          <p className="text-[#b85c1a]/60 text-xs uppercase tracking-[0.3em] mb-3 font-light">
            Tu cocina, tu mundo
          </p>
          <p className="text-[#5c3010]/70 text-base leading-relaxed font-light">
            Descubre, guarda y comparte<br />
            <span className="text-[#E8631A] font-medium">tus recetas favoritas</span>
          </p>
        </div>
 
        {/* Separador decorativo */}
        <div className="flex items-center gap-3 my-8 w-full max-w-xs" style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.5s',
        }}>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #E8631A44)' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#E8631A] opacity-60" />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #E8631A44)' }} />
        </div>
 
        {/* Botones */}
        <div className="w-full flex flex-col gap-4 max-w-xs" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
        }}>
          <button
            onClick={() => navigate('/login')}
            className="relative w-full font-semibold py-4 rounded-2xl overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #E8631A 0%, #cf4f10 100%)',
              boxShadow: '0 8px 32px rgba(232,99,26,0.45), 0 2px 8px rgba(0,0,0,0.3)',
              color: 'white',
              letterSpacing: '0.04em',
            }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #ff7a33 0%, #E8631A 100%)' }} />
            <span className="relative z-10">Iniciar sesión</span>
          </button>
 
          <button
            onClick={() => navigate('/registro')}
            className="relative w-full font-semibold py-4 rounded-2xl transition-all duration-300"
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(232,99,26,0.5)',
              color: '#E8631A',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#E8631A';
              e.currentTarget.style.background = 'rgba(232,99,26,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(232,99,26,0.5)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Registrarse
          </button>
        </div>
 
        {/* Pie decorativo */}
        <div className="mt-10 flex items-center gap-2" style={{
          opacity: visible ? 0.35 : 0,
          transition: 'opacity 0.8s ease 0.9s',
        }}>
          <div className="w-1 h-1 rounded-full bg-[#E8631A]" />
          <p className="text-[#b85c1a]/50 text-xs tracking-widest uppercase font-light">Coockit · 2025</p>
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