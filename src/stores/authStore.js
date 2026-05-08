// ─────────────────────────────────────────────
// authStore.js — Estado global de autenticación
// Usa Zustand para guardar el usuario y el perfil en memoria.
// Todas las páginas acceden al usuario con: useAuthStore()
// Para añadir más datos del usuario, amplía la tabla "profiles" en Supabase
// y recupéralos en la función cargarPerfil().
// ─────────────────────────────────────────────

import { create } from 'zustand';
import supabase from '../supabaseClient';

export const useAuthStore = create((set, get) => ({
  // ── Estado ──────────────────────────────────────────────────────────
  // usuario: objeto de Supabase Auth (tiene id, email, etc.)
  // perfil:  fila de la tabla "profiles" (tiene full_name, etc.)
  // cargando: true mientras se comprueba si hay sesión guardada
  usuario: null,
  perfil: null,
  cargando: true,

  // Setters directos (usados internamente por useAuthInit)
  setUsuario: (usuario) => set({ usuario }),
  setPerfil: (perfil) => set({ perfil }),
  setCargando: (cargando) => set({ cargando }),

  // ── Cargar perfil desde la BD ────────────────────────────────────────
  // Se llama automáticamente al iniciar sesión.
  // Para añadir más campos del perfil, añádelos al SELECT o usa select('*')
  cargarPerfil: async (idUsuario) => {
    const { data } = await supabase
      .from('profiles')   // Tabla en Supabase → modifica aquí si la renombras
      .select('*')
      .eq('id', idUsuario)
      .single();
    set({ perfil: data, cargando: false });
  },

  // ── Registro ─────────────────────────────────────────────────────────
  // Para pedir más datos al registrarse (ej: teléfono), añádelos en options.data
  // y recupéralos luego en la tabla profiles mediante un trigger de Supabase
  registrarse: async (email, contrasena, nombreCompleto) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: contrasena,
      options: { data: { full_name: nombreCompleto } }, // Datos extra del usuario
    });
    return { data, error };
  },

  // ── Inicio de sesión ──────────────────────────────────────────────────
  // Para cambiar el mensaje de error que ve el usuario, ve a PaginaLogin.jsx
  iniciarSesion: async (email, contrasena) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: contrasena,
    });
    return { data, error };
  },

  // ── Cerrar sesión ─────────────────────────────────────────────────────
  // Limpia el estado local y cierra la sesión en Supabase
  cerrarSesion: async () => {
    await supabase.auth.signOut();
    set({ usuario: null, perfil: null });
  },

  // ── Refrescar sesión ──────────────────────────────────────────────────
  // Se usa antes de hacer cambios sensibles (actualizar perfil) para
  // asegurarse de que el token no ha caducado
  asegurarSesion: async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) return false;
    if (data?.user) set({ usuario: data.user });
    return true;
  },

  // ── Actualizar perfil ─────────────────────────────────────────────────
  // Permite cambiar nombre, email y/o contraseña desde PaginaPerfil.jsx
  // Para añadir más campos editables (ej: avatar), amplía este objeto
  // y actualiza la tabla "profiles" en Supabase con el campo nuevo
  actualizarPerfil: async ({ nuevoNombre, nuevoEmail, nuevaContrasena }) => {
    const { usuario, perfil } = get();
    const errores = {};

    const sesionOk = await get().asegurarSesion();
    if (!sesionOk) {
      return { errores: { general: 'Tu sesión ha caducado. Por favor, cierra sesión e inicia de nuevo.' } };
    }

    // Comprobar que el nombre no esté ya en uso por otro usuario
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
      set({ perfil: { ...perfil, full_name: nuevoNombre.trim() } });
    }

    // Actualizar email en Supabase Auth (el usuario recibirá un correo de confirmación)
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

    // Actualizar contraseña en Supabase Auth
    if (nuevaContrasena) {
      const { error } = await supabase.auth.updateUser({ password: nuevaContrasena });
      if (error) return { errores: { contrasena: error.message } };
    }

    return { exito: true };
  },

  // ── Eliminar cuenta ───────────────────────────────────────────────────
  // Llama a la función SQL "delete_user_account" que borra:
  //   1. Favoritos del usuario (tabla favorites)
  //   2. Perfil del usuario (tabla profiles)
  //   3. La cuenta de Supabase Auth
  // Si añades nuevas tablas con datos del usuario, agrégalas al DELETE
  // en la función SQL del dashboard: SQL Editor → delete_user_account
  borrarCuenta: async () => {
    try {
      const { usuario } = get();
      if (!usuario?.id) {
        return { errores: { general: 'No hay una sesión activa.' } };
      }

      // Ejecuta la función SQL definida en Supabase
      const { error } = await supabase.rpc('delete_user_account');
      if (error) {
        return { errores: { general: error.message || 'Error al eliminar la cuenta' } };
      }

      await supabase.auth.signOut();
      set({ usuario: null, perfil: null });

      return { exito: true };
    } catch (error) {
      return { errores: { general: error.message || 'Error al eliminar la cuenta' } };
    }
  },
}));
