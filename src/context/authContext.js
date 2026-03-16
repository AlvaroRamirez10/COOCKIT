import { createContext, useContext } from 'react';

export const ContextoAuth = createContext({});

export const useAuth = () => useContext(ContextoAuth);
