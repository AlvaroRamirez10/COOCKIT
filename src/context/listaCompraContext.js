import { createContext, useContext } from 'react';

export const ContextoListaCompra = createContext({});

export const useListaCompra = () => useContext(ContextoListaCompra);
