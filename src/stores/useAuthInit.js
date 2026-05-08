import { useEffect } from 'react';
import supabase from '../supabaseClient';
import { useAuthStore } from './authStore';

export const useAuthInit = () => {
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const { setUsuario, cargarPerfil, setCargando } = useAuthStore.getState();
      
      setUsuario(session?.user ?? null);
      if (session?.user) {
        await cargarPerfil(session.user.id);
      } else {
        setCargando(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      const { setUsuario, cargarPerfil, setPerfil, setCargando } = useAuthStore.getState();
      
      setUsuario(session?.user ?? null);
      if (session?.user) {
        cargarPerfil(session.user.id);
      } else {
        setPerfil(null);
        setCargando(false);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
};
