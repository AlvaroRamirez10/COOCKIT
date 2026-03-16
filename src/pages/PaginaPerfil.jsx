import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Heart, ChevronRight, Pencil, X, Check, Eye, EyeOff, Mail, Lock, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { useFavoritos } from '../context/favoritosContext';
import NavegacionInferior from '../components/NavegacionInferior';
import BarraBusqueda from '../components/BarraBusqueda';

const campoStyle = {
  width: '100%',
  padding: '0.65rem 0.875rem',
  borderRadius: '0.75rem',
  border: '1.5px solid #e5d5c5',
  background: '#fffaf5',
  color: '#3d1a00',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function PaginaPerfil() {
  const { usuario, perfil, cerrarSesion, actualizarPerfil } = useAuth();
  const { favoritos } = useFavoritos();
  const navigate = useNavigate();

  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);

  const nombreMostrado = perfil?.full_name || usuario?.email?.split('@')[0] || 'Usuario';
  const iniciales = nombreMostrado.charAt(0).toUpperCase();

  const [form, setForm] = useState({
    nombre: perfil?.full_name || '',
    email: usuario?.email || '',
    contrasena: '',
    confirmar: '',
  });
  const [errores, setErrores] = useState({});

  const setField = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErrores(prev => ({ ...prev, [campo]: undefined }));
  };

  const abrirEdicion = () => {
    setForm({ nombre: perfil?.full_name || '', email: usuario?.email || '', contrasena: '', confirmar: '' });
    setErrores({});
    setExito(false);
    setEditando(true);
  };

  const guardar = async () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre no puede estar vacío';
    if (!form.email.trim()) nuevosErrores.email = 'El email no puede estar vacío';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      nuevosErrores.email = 'Introduce un email válido';

    if (form.contrasena) {
      if (form.contrasena.length < 6) nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      else if (form.contrasena !== form.confirmar) nuevosErrores.confirmar = 'Las contraseñas no coinciden';
    }

    if (Object.keys(nuevosErrores).length > 0) { setErrores(nuevosErrores); return; }

    setGuardando(true);
    const { exito: ok, errores: errBack } = await actualizarPerfil({
      nuevoNombre: form.nombre,
      nuevoEmail: form.email,
      nuevaContrasena: form.contrasena || null,
    });
    setGuardando(false);

    if (errBack) { setErrores(errBack); return; }
    if (ok) {
      setExito(true);
      setForm(prev => ({ ...prev, contrasena: '', confirmar: '' }));
      setTimeout(() => setEditando(false), 1800);
    }
  };

  const manejarCerrarSesion = async () => {
    await cerrarSesion();
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FDF6ED' }}>

      {/* Cabecera */}
      <div
        style={{
          background: 'linear-gradient(135deg, #E8631A 0%, #cf4f10 60%, #b83e08 100%)',
          borderRadius: '0 0 2rem 2rem',
          boxShadow: '0 8px 32px rgba(232,99,26,0.25)',
        }}
        className="px-6 pt-10 pb-12 flex flex-col items-center"
      >
        <div
          style={{
            width: '5rem', height: '5rem', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#E8631A', fontWeight: 800, fontSize: '2rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            marginBottom: '0.75rem',
          }}
        >
          {iniciales}
        </div>
        <h1 style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>{nombreMostrado}</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{usuario?.email}</p>
        <button
          onClick={abrirEdicion}
          style={{
            marginTop: '0.9rem',
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            color: 'white',
            borderRadius: '999px',
            padding: '0.35rem 1rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Pencil size={13} /> Editar perfil
        </button>
      </div>

      {/* Panel edición */}
      {editando && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: '4.5rem',
          }}
          onClick={e => { if (e.target === e.currentTarget) setEditando(false); }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '1.5rem',
              width: '100%',
              maxWidth: '480px',
              padding: '1.5rem 1.5rem 2rem',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            {/* Cabecera modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#3d1a00' }}>Editar perfil</h2>
              <button
                onClick={() => setEditando(false)}
                style={{ background: '#f5ede3', border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} color="#8a5a3a" />
              </button>
            </div>

            {exito && (
              <div style={{ background: '#f0fff4', border: '1px solid #86efac', borderRadius: '0.75rem', padding: '0.65rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontSize: '0.85rem' }}>
                <Check size={15} /> Cambios guardados correctamente
                {form.email !== usuario?.email && <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }}>(confirma el nuevo email en tu bandeja)</span>}
              </div>
            )}

            {errores.general && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.75rem', padding: '0.65rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.82rem' }}>
                {errores.general}
              </div>
            )}

            {/* Campo nombre */}
            <label style={{ display: 'block', marginBottom: '0.9rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#b85c1a', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                <User size={13} /> Nombre
              </span>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setField('nombre', e.target.value)}
                style={{ ...campoStyle, borderColor: errores.nombre ? '#f87171' : '#e5d5c5' }}
                placeholder="Tu nombre completo"
              />
              {errores.nombre && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errores.nombre}</p>}
            </label>

            {/* Campo email */}
            <label style={{ display: 'block', marginBottom: '0.9rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#b85c1a', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                <Mail size={13} /> Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                style={{ ...campoStyle, borderColor: errores.email ? '#f87171' : '#e5d5c5' }}
                placeholder="correo@ejemplo.com"
              />
              {errores.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errores.email}</p>}
              {form.email !== usuario?.email && !errores.email && (
                <p style={{ color: '#b85c1a', fontSize: '0.72rem', marginTop: '0.25rem' }}>⚠ Recibirás un email de confirmación</p>
              )}
            </label>

            {/* Divisor */}
            <div style={{ borderTop: '1px solid #f0e4d7', margin: '1rem 0 0.9rem' }} />
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#b85c1a', marginBottom: '0.75rem' }}>Cambiar contraseña (opcional)</p>

            {/* Campo contraseña */}
            <label style={{ display: 'block', marginBottom: '0.9rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8a7060', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                <Lock size={13} /> Nueva contraseña
              </span>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarPass ? 'text' : 'password'}
                  value={form.contrasena}
                  onChange={e => setField('contrasena', e.target.value)}
                  style={{ ...campoStyle, borderColor: errores.contrasena ? '#f87171' : '#e5d5c5', paddingRight: '2.5rem' }}
                  placeholder="Mín. 6 caracteres"
                />
                <button type="button" onClick={() => setMostrarPass(v => !v)}
                  style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#b0856a' }}>
                  {mostrarPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errores.contrasena && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errores.contrasena}</p>}
            </label>

            {/* Campo confirmar */}
            {form.contrasena && (
              <label style={{ display: 'block', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8a7060', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                  <Lock size={13} /> Confirmar contraseña
                </span>
                <div style={{ position: 'relative' }}>
                  <input
                    type={mostrarConfirm ? 'text' : 'password'}
                    value={form.confirmar}
                    onChange={e => setField('confirmar', e.target.value)}
                    style={{ ...campoStyle, borderColor: errores.confirmar ? '#f87171' : '#e5d5c5', paddingRight: '2.5rem' }}
                    placeholder="Repite la contraseña"
                  />
                  <button type="button" onClick={() => setMostrarConfirm(v => !v)}
                    style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#b0856a' }}>
                    {mostrarConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errores.confirmar && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errores.confirmar}</p>}
              </label>
            )}

            {/* Botón guardar */}
            <button
              onClick={guardar}
              disabled={guardando}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '0.875rem',
                border: 'none',
                background: guardando ? '#e0b898' : 'linear-gradient(135deg, #E8631A, #cf4f10)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: guardando ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(232,99,26,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {guardando ? (
                <><div style={{ width: '1rem', height: '1rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Guardando...</>
              ) : (
                <><Check size={16} /> Guardar cambios</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="max-w-5xl mx-auto px-6 -mt-5">
        <div
          style={{
            background: 'white',
            borderRadius: '1.25rem',
            boxShadow: '0 4px 20px rgba(232,99,26,0.1)',
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E8631A' }}>{favoritos.length}</span>
            <p style={{ fontSize: '0.72rem', color: '#a06040', marginTop: '0.1rem' }}>Favoritos guardados</p>
          </div>
        </div>
      </div>

      {/* Opciones */}
      <div className="max-w-5xl mx-auto px-6 mt-6 flex flex-col gap-3">

        <button
          onClick={() => navigate('/favoritos')}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E8631A]/10 flex items-center justify-center">
            <Heart size={20} className="text-[#E8631A]" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-800">Mis Favoritos</p>
            <p className="text-xs text-gray-400">{favoritos.length} recetas guardadas</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </button>

        <button
          onClick={() => navigate('/planificador')}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E8631A]/10 flex items-center justify-center">
            <CalendarDays size={20} className="text-[#E8631A]" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-800">Planificador semanal</p>
            <p className="text-xs text-gray-400">Organiza comidas y cenas</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </button>

        <button
          onClick={() => navigate('/inicio')}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E8631A]/10 flex items-center justify-center">
            <User size={20} className="text-[#E8631A]" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-800">Explorar recetas</p>
            <p className="text-xs text-gray-400">Volver al inicio</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={manejarCerrarSesion}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all border border-red-100"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut size={20} className="text-red-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-red-500">Cerrar sesión</p>
            <p className="text-xs text-gray-400">Salir de tu cuenta</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </button>
      </div>

      {mostrarBusqueda && <BarraBusqueda onCerrar={() => setMostrarBusqueda(false)} />}
      <NavegacionInferior onToggleBusqueda={() => setMostrarBusqueda(true)} />
    </div>
  );
}