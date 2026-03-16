import { createContext, useContext } from 'react';

export const ContextoPlanificador = createContext({});

export const usePlanificador = () => useContext(ContextoPlanificador);
