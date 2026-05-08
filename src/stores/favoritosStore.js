import { create } from 'zustand';
import supabase from '../supabaseClient';

export const useFavoritosStore = create((set) => ({
  favoritos: [],

  setFavoritos: (favoritos) => set({ favoritos }),

  cargarFavoritos: async (usuarioId) => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', usuarioId)
      .order('created_at', { ascending: false });
    set({ favoritos: data || [] });
  },

  agregarFavorito: async (usuarioId, receta) => {
    await supabase.auth.refreshSession();
    const { error } = await supabase.from('favorites').insert({
      user_id: usuarioId,
      meal_id: receta.idMeal,
      meal_name: receta.strMeal,
      meal_thumb: receta.strMealThumb,
      meal_category: receta.strCategory || null,
      meal_area: receta.strArea || null,
    });
    if (!error) {
      set((state) => ({
        favoritos: [
          {
            user_id: usuarioId,
            meal_id: receta.idMeal,
            meal_name: receta.strMeal,
            meal_thumb: receta.strMealThumb,
            meal_category: receta.strCategory || null,
            meal_area: receta.strArea || null,
            created_at: new Date().toISOString(),
          },
          ...state.favoritos,
        ],
      }));
    }
  },

  quitarFavorito: async (usuarioId, idReceta) => {
    await supabase.auth.refreshSession();
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', usuarioId)
      .eq('meal_id', idReceta);
    if (!error) {
      set((state) => ({
        favoritos: state.favoritos.filter((f) => f.meal_id !== idReceta),
      }));
    }
  },
}));
