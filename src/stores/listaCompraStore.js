import { create } from 'zustand';

const normalizar = (texto = '') => texto.trim().toLowerCase();

const unirCantidades = (actual = '', nueva = '') => {
  const a = actual.trim();
  const n = nueva.trim();
  if (!a) return n;
  if (!n || a.toLowerCase() === n.toLowerCase()) return a;
  return `${a} + ${n}`;
};

const unirRecetas = (actual = '', nueva = '') => {
  const lista = (actual || '')
    .split(' · ')
    .map((x) => x.trim())
    .filter(Boolean);
  if (!lista.includes(nueva)) lista.push(nueva);
  return lista.join(' · ');
};

export const useListaCompraStore = create((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  cargarDelLocalStorage: (usuarioId) => {
    try {
      const storageKey = `coockit_lista_${usuarioId}`;
      const guardado = localStorage.getItem(storageKey);
      set({ items: guardado ? JSON.parse(guardado) : [] });
    } catch {
      set({ items: [] });
    }
  },

  guardarEnLocalStorage: (usuarioId) => {
    const { items } = get();
    const storageKey = `coockit_lista_${usuarioId}`;
    localStorage.setItem(storageKey, JSON.stringify(items));
  },

  agregarDesdeReceta: (receta) => {
    const nuevos = [];
    for (let i = 1; i <= 20; i++) {
      const ingrediente = receta[`strIngredient${i}`];
      const cantidad = receta[`strMeasure${i}`];
      if (ingrediente && ingrediente.trim()) {
        nuevos.push({
          id: `${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
          nombre: ingrediente.trim(),
          cantidad: cantidad?.trim() || '',
          receta: receta.strMeal || 'Receta',
          comprado: false,
        });
      }
    }

    let cantidadAgregada = 0;
    let cantidadActualizada = 0;

    set((state) => {
      const copia = [...state.items];
      for (const nuevo of nuevos) {
        const index = copia.findIndex((it) => normalizar(it.nombre) === normalizar(nuevo.nombre));
        if (index === -1) {
          copia.push(nuevo);
          cantidadAgregada += 1;
        } else {
          copia[index] = {
            ...copia[index],
            cantidad: unirCantidades(copia[index].cantidad || '', nuevo.cantidad || ''),
            receta: unirRecetas(copia[index].receta || '', nuevo.receta || 'Receta'),
          };
          cantidadActualizada += 1;
        }
      }
      return { items: copia };
    });

    return { agregados: cantidadAgregada, actualizados: cantidadActualizada };
  },

  alternarComprado: (id) => {
    set((state) => ({
      items: state.items.map((it) => (it.id === id ? { ...it, comprado: !it.comprado } : it)),
    }));
  },

  eliminarItem: (id) => {
    set((state) => ({
      items: state.items.filter((it) => it.id !== id),
    }));
  },

  limpiarComprados: () => {
    set((state) => ({
      items: state.items.filter((it) => !it.comprado),
    }));
  },

  limpiarTodo: () => {
    set({ items: [] });
  },
}));
