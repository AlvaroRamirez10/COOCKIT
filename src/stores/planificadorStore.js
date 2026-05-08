import { create } from 'zustand';

const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const crearSemanaVacia = () => {
  const semana = {};
  for (const dia of diasSemana) {
    semana[dia] = { comida: null, cena: null };
  }
  return semana;
};

export const usePlanificadorStore = create((set, get) => ({
  plan: crearSemanaVacia(),
  diasSemana,

  cargarDelLocalStorage: (usuarioId) => {
    try {
      const storageKey = `coockit_plan_${usuarioId}`;
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        set({ plan: crearSemanaVacia() });
        return;
      }
      const guardado = JSON.parse(raw);
      const base = crearSemanaVacia();
      for (const dia of diasSemana) {
        base[dia] = {
          comida: guardado?.[dia]?.comida || null,
          cena: guardado?.[dia]?.cena || null,
        };
      }
      set({ plan: base });
    } catch {
      set({ plan: crearSemanaVacia() });
    }
  },

  guardarEnLocalStorage: (usuarioId) => {
    const { plan } = get();
    const storageKey = `coockit_plan_${usuarioId}`;
    localStorage.setItem(storageKey, JSON.stringify(plan));
  },

  planificarReceta: ({ dia, tipo, receta }) => {
    if (!dia || !tipo || !receta) return;
    set((state) => ({
      plan: {
        ...state.plan,
        [dia]: {
          ...state.plan[dia],
          [tipo]: {
            idMeal: receta.idMeal,
            strMeal: receta.strMeal,
            strMealThumb: receta.strMealThumb,
            strCategory: receta.strCategory || null,
          },
        },
      },
    }));
  },

  limpiarSlot: (dia, tipo) => {
    set((state) => ({
      plan: {
        ...state.plan,
        [dia]: {
          ...state.plan[dia],
          [tipo]: null,
        },
      },
    }));
  },

  limpiarDia: (dia) => {
    set((state) => ({
      plan: {
        ...state.plan,
        [dia]: { comida: null, cena: null },
      },
    }));
  },

  limpiarSemana: () => {
    set({ plan: crearSemanaVacia() });
  },
}));
