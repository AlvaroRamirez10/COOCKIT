import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { useAuth } from './authContext';
import { ContextoFavoritos } from './favoritosContext';

export const ProveedorFavoritos = ({ children }) => {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState([]);

  const cargarFavoritos = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', usuario.id)
      .order('created_at', { ascending: false });
    setFavoritos(data || []);
  };

  useEffect(() => {
    const sincronizarFavoritos = async () => {
      if (!usuario) {
        await Promise.resolve();
        setFavoritos([]);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', usuario.id)
        .order('created_at', { ascending: false });

      setFavoritos(data || []);
    };

    sincronizarFavoritos();
  }, [usuario]);

  const refrescarSesion = async () => {
    await supabase.auth.refreshSession();
  };

  const agregarFavorito = async (receta) => {
    await refrescarSesion();
    const { error } = await supabase.from('favorites').insert({
      user_id: usuario.id,
      meal_id: receta.idMeal,
      meal_name: receta.strMeal,
      meal_thumb: receta.strMealThumb,
      meal_category: receta.strCategory || null,
      meal_area: receta.strArea || null,
    });
    if (!error) cargarFavoritos();
  };

  const quitarFavorito = async (idReceta) => {
    await refrescarSesion();
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', usuario.id)
      .eq('meal_id', idReceta);
    if (!error) setFavoritos(prev => prev.filter(f => f.meal_id !== idReceta));
  };

  const esFavorito = (idReceta) => favoritos.some(f => f.meal_id === idReceta);

  return (
    <ContextoFavoritos.Provider value={{ favoritos, agregarFavorito, quitarFavorito, esFavorito }}>
      {children}
    </ContextoFavoritos.Provider>
  );
};