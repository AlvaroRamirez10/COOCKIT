import { useEffect, useMemo, useState, startTransition } from 'react';
import { ContextoListaCompra } from './listaCompraContext';
import { useAuth } from './authContext';

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

export const ProveedorListaCompra = ({ children }) => {
  const { usuario } = useAuth();
  const [items, setItems] = useState([]);

  const storageKey = useMemo(() => {
    if (!usuario?.id) return null;
    return `coockit_lista_${usuario.id}`;
  }, [usuario?.id]);

  useEffect(() => {
    if (!storageKey) {
      startTransition(() => setItems([]));
      return;
    }
    try {
      const guardado = localStorage.getItem(storageKey);
      startTransition(() => setItems(guardado ? JSON.parse(guardado) : []));
    } catch {
      startTransition(() => setItems([]));
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [storageKey, items]);

  const agregarDesdeReceta = (receta) => {
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
    setItems((prev) => {
      const copia = [...prev];
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
      return copia;
    });

    return { agregados: cantidadAgregada, actualizados: cantidadActualizada };
  };

  const alternarComprado = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, comprado: !it.comprado } : it)));
  };

  const eliminarItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const limpiarComprados = () => {
    setItems((prev) => prev.filter((it) => !it.comprado));
  };

  const vaciarLista = () => setItems([]);

  return (
    <ContextoListaCompra.Provider
      value={{
        items,
        agregarDesdeReceta,
        alternarComprado,
        eliminarItem,
        limpiarComprados,
        vaciarLista,
      }}
    >
      {children}
    </ContextoListaCompra.Provider>
  );
};
