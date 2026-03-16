import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { ContextoAuth } from './authContext';

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);


  const cargarPerfil = async (idUsuario) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', idUsuario)
      .single();
    setPerfil(data);
    setCargando(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
      if (session?.user) cargarPerfil(session.user.id);
      else setCargando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUsuario(session?.user ?? null);
      if (session?.user) cargarPerfil(session.user.id);
      else { setPerfil(null); setCargando(false); }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const registrarse = async (email, contrasena, nombreCompleto) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: contrasena,
      options: { data: { full_name: nombreCompleto } },
    });
    return { data, error };
  };

  const iniciarSesion = async (email, contrasena) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: contrasena,
    });
    return { data, error };
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  // Refresca el token JWT si ha caducado
  const asegurarSesion = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) return false;
    if (data?.user) setUsuario(data.user);
    return true;
  };

  // Actualiza nombre, email y/o contraseña
  // Devuelve { exito: true } o { errores: { campo: mensaje } }
  const actualizarPerfil = async ({ nuevoNombre, nuevoEmail, nuevaContrasena }) => {
    const errores = {};

    // Refrescar sesión antes de operar para evitar errores JWT expired
    const sesionOk = await asegurarSesion();
    if (!sesionOk) return { errores: { general: 'Tu sesión ha caducado. Por favor, cierra sesión e inicia de nuevo.' } };

    // Verificar nombre duplicado (si cambió)
    if (nuevoNombre && nuevoNombre.trim() !== (perfil?.full_name || '').trim()) {
      const { data: existente } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', nuevoNombre.trim())
        .neq('id', usuario.id)
        .maybeSingle();
      if (existente) errores.nombre = 'Ese nombre ya está en uso por otra cuenta';
    }

    if (Object.keys(errores).length > 0) return { errores };

    // Actualizar nombre en la tabla profiles
    if (nuevoNombre && nuevoNombre.trim() !== (perfil?.full_name || '').trim()) {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: nuevoNombre.trim() })
        .eq('id', usuario.id);
      if (error) return { errores: { nombre: error.message } };
      setPerfil(prev => ({ ...prev, full_name: nuevoNombre.trim() }));
    }

    // Actualizar email (Supabase devuelve error si ya está registrado)
    if (nuevoEmail && nuevoEmail.trim() !== usuario.email) {
      const { error } = await supabase.auth.updateUser({ email: nuevoEmail.trim() });
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('already in use') || msg.includes('duplicate')) {
          return { errores: { email: 'Ese email ya está registrado en otra cuenta' } };
        }
        return { errores: { email: error.message } };
      }
    }

    // Actualizar contraseña
    if (nuevaContrasena) {
      const { error } = await supabase.auth.updateUser({ password: nuevaContrasena });
      if (error) return { errores: { contrasena: error.message } };
    }

    return { exito: true };
  };

  return (
    <ContextoAuth.Provider value={{ usuario, perfil, cargando, registrarse, iniciarSesion, cerrarSesion, actualizarPerfil }}>
      {children}
    </ContextoAuth.Provider>
  );
};
