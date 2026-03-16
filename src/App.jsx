import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAuth } from './context/ContextoAuth';
import { ProveedorFavoritos } from './context/ContextoFavoritos';
import { ProveedorListaCompra } from './context/ContextoListaCompra';
import { ProveedorPlanificador } from './context/ContextoPlanificador';
import RutaProtegida from './components/RutaProtegida';

import PaginaInicial   from './pages/PaginaInicial';
import PaginaLogin     from './pages/PaginaLogin';
import PaginaRegistro  from './pages/PaginaRegistro';
import PaginaInicio    from './pages/PaginaInicio';
import PaginaReceta    from './pages/PaginaReceta';
import PaginaFavoritos from './pages/PaginaFavoritos';
import PaginaListaCompra from './pages/PaginaListaCompra';
import PaginaPlanificador from './pages/PaginaPlanificador';
import PaginaPerfil    from './pages/PaginaPerfil';

export default function App() {
  return (
    <BrowserRouter>
      <ProveedorAuth>
        <ProveedorFavoritos>
          <ProveedorListaCompra>
            <ProveedorPlanificador>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/"          element={<PaginaInicial />} />
                <Route path="/login"     element={<PaginaLogin />} />
                <Route path="/registro"  element={<PaginaRegistro />} />

                {/* Rutas protegidas */}
                <Route path="/inicio" element={
                  <RutaProtegida><PaginaInicio /></RutaProtegida>
                } />
                <Route path="/receta/:id" element={
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

                {/* Redirigir cualquier ruta desconocida al inicio */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ProveedorPlanificador>
          </ProveedorListaCompra>
        </ProveedorFavoritos>
      </ProveedorAuth>
    </BrowserRouter>
  );
}