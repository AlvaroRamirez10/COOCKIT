import { useEffect, useMemo, useState, startTransition } from 'react';
import { ContextoPlanificador } from './planificadorContext';
import { useAuth } from './authContext';

const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const crearSemanaVacia = () => {
  const semana = {};
  for (const dia of diasSemana) {
    semana[dia] = { comida: null, cena: null };
  }
  return semana;
};

export const ProveedorPlanificador = ({ children }) => {
  const { usuario } = useAuth();
  const [plan, setPlan] = useState(crearSemanaVacia());

  const storageKey = useMemo(() => {
    if (!usuario?.id) return null;
    return `coockit_plan_${usuario.id}`;
  }, [usuario?.id]);

  useEffect(() => {
    if (!storageKey) {
      startTransition(() => setPlan(crearSemanaVacia()));
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        startTransition(() => setPlan(crearSemanaVacia()));
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
      startTransition(() => setPlan(base));
    } catch {
      startTransition(() => setPlan(crearSemanaVacia()));
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(plan));
  }, [storageKey, plan]);

  const planificarReceta = ({ dia, tipo, receta }) => {
    if (!dia || !tipo || !receta) return;
    setPlan((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [tipo]: {
          idMeal: receta.idMeal,
          strMeal: receta.strMeal,
          strMealThumb: receta.strMealThumb,
          strCategory: receta.strCategory || null,
        },
      },
    }));
  };

  const limpiarSlot = (dia, tipo) => {
    setPlan((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [tipo]: null,
      },
    }));
  };

  const limpiarDia = (dia) => {
    setPlan((prev) => ({
      ...prev,
      [dia]: { comida: null, cena: null },
    }));
  };

  const limpiarSemana = () => setPlan(crearSemanaVacia());

  return (
    <ContextoPlanificador.Provider
      value={{
        diasSemana,
        plan,
        planificarReceta,
        limpiarSlot,
        limpiarDia,
        limpiarSemana,
      }}
    >
      {children}
    </ContextoPlanificador.Provider>
  );
};
