// ─────────────────────────────────────────────
// RutaProtegida.jsx — Guardia de rutas privadas
// Envuelve cualquier página que requiera login.
// Si el usuario no está autenticado, lo redirige a "/".
// Para cambiar la página de redirección, modifica el to="/" de abajo.
// Para añadir más condiciones (ej: rol de admin), añade lógica aquí.
// ─────────────────────────────────────────────

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function RutaProtegida({ children }) {
  // Leemos el usuario y el estado de carga del store global
  const { usuario, cargando } = useAuthStore();

  // Mientras se comprueba si hay sesión guardada, muestra un spinner
  // Para cambiar el spinner, modifica el JSX de abajo
  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8631A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si hay usuario autenticado, muestra la página; si no, redirige
  return usuario ? children : <Navigate to="/" replace />;
}
