// ─────────────────────────────────────────────
// App.jsx — Punto de entrada de la aplicación
// Aquí se definen TODAS las rutas (páginas) de la app.
// Para añadir una nueva página:
//   1. Importa el componente arriba
//   2. Añade un <Route> nuevo abajo
//   3. Si requiere login, envuélvelo en <RutaProtegida>
// ─────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthInit } from './stores/useAuthInit';   // Inicia la sesión al cargar la app
import { useSyncStores } from './stores/useSyncStores'; // Sincroniza los stores con Supabase
import RutaProtegida from './components/RutaProtegida'; // Componente que bloquea páginas si no hay sesión

import PaginaInicial   from './pages/PaginaInicial';
import PaginaLogin     from './pages/PaginaLogin';
import PaginaRegistro  from './pages/PaginaRegistro';
import PaginaInicio    from './pages/PaginaInicio';
import PaginaReceta    from './pages/PaginaReceta';
import PaginaFavoritos from './pages/PaginaFavoritos';
import PaginaListaCompra from './pages/PaginaListaCompra';
import PaginaPlanificador from './pages/PaginaPlanificador';
import PaginaPerfil    from './pages/PaginaPerfil';

function AppContent() {
  useAuthInit();    // Recupera la sesión guardada al iniciar (no tocar)
  useSyncStores();  // Carga favoritos, planificador, etc. cuando el usuario inicia sesión

  return (
    <Routes>
      {/* ── Rutas públicas (accesibles sin login) ──────────────────────
          Para cambiar la página de inicio, modifica el path="/" */}
      <Route path="/"          element={<PaginaInicial />} />
      <Route path="/login"     element={<PaginaLogin />} />
      <Route path="/registro"  element={<PaginaRegistro />} />

      {/* ── Rutas protegidas (redirigen a "/" si no hay sesión) ─────────
          Para hacer una ruta pública, quita el <RutaProtegida> */}
      <Route path="/inicio" element={
        <RutaProtegida><PaginaInicio /></RutaProtegida>
      } />
      <Route path="/receta/:id" element={
        // :id es el identificador de la receta (viene de la API)
        <RutaProtegida><PaginaReceta /></RutaProtegida>
      } />
      <Route path="/favoritos" element={
        <RutaProtegida><PaginaFavoritos /></RutaProtegida>
      } />
      <Route path="/lista-compra" element={
        <RutaProtegida><PaginaListaCompra /></RutaProtegida>
      } />
      <Route path="/planificador" element={
        <RutaProtegida><PaginaPlanificador /></RutaProtegida>
      } />
      <Route path="/perfil" element={
        <RutaProtegida><PaginaPerfil /></RutaProtegida>
      } />

      {/* Cualquier ruta desconocida redirige al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    // BrowserRouter habilita la navegación sin recargar la página
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
