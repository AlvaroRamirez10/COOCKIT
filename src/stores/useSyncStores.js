import { useEffect } from 'react';
import { useAuthStore } from './authStore';
import { useFavoritosStore } from './favoritosStore';
import { useListaCompraStore } from './listaCompraStore';
import { usePlanificadorStore } from './planificadorStore';

export const useSyncStores = () => {
  const usuario = useAuthStore((state) => state.usuario);

  // Sincronizar favoritos cuando el usuario cambia
  useEffect(() => {
    if (usuario) {
      const { cargarFavoritos } = useFavoritosStore.getState();
      const { cargarDelLocalStorage: cargarListaCompra } = useListaCompraStore.getState();
      const { cargarDelLocalStorage: cargarPlanificador } = usePlanificadorStore.getState();

      cargarFavoritos(usuario.id);
      cargarListaCompra(usuario.id);
      cargarPlanificador(usuario.id);
    }
  }, [usuario]);

  // Guardar lista de compra en localStorage cuando cambia
  const items = useListaCompraStore((state) => state.items);
  useEffect(() => {
    if (usuario) {
      const { guardarEnLocalStorage } = useListaCompraStore.getState();
      guardarEnLocalStorage(usuario.id);
    }
  }, [items, usuario]);

  // Guardar planificador en localStorage cuando cambia
  const plan = usePlanificadorStore((state) => state.plan);
  useEffect(() => {
    if (usuario) {
      const { guardarEnLocalStorage } = usePlanificadorStore.getState();
      guardarEnLocalStorage(usuario.id);
    }
  }, [plan, usuario]);
};
