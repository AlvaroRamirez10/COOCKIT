import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8631A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return usuario ? children : <Navigate to="/" replace />;
}