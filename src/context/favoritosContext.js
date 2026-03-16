import { createContext, useContext } from 'react';

export const ContextoFavoritos = createContext({});

export const useFavoritos = () => useContext(ContextoFavoritos);
