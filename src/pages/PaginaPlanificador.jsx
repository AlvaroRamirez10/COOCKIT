import { useState } from 'react';
import { CalendarDays, UtensilsCrossed, MoonStar, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlanificadorStore } from '../stores/planificadorStore';
import NavegacionInferior from '../components/NavegacionInferior';
import BarraBusqueda from '../components/BarraBusqueda';

export default function PaginaPlanificador() {
  const navigate = useNavigate();
  const { diasSemana, plan, limpiarSlot, limpiarDia, limpiarSemana } = usePlanificadorStore();
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  const totalSlots = diasSemana.length * 2;
  const usados = diasSemana.reduce((acc, dia) => {
    return acc + (plan[dia].comida ? 1 : 0) + (plan[dia].cena ? 1 : 0);
  }, 0);

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FDF6ED' }}>
      <div
        className="px-6 pt-8 pb-6"
        style={{
          background: 'linear-gradient(135deg, #E8631A 0%, #cf4f10 65%, #b83e08 100%)',
          borderRadius: '0 0 2rem 2rem',
          boxShadow: '0 8px 24px rgba(232,99,26,0.25)',
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-white font-bold text-xl">Planificador semanal</h1>
            <p className="text-white/70 text-sm">{usados} de {totalSlots} comidas planificadas</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <CalendarDays className="text-white" size={22} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-5">
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={limpiarSemana}
            className="text-xs px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
          >
            Limpiar semana
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diasSemana.map((dia) => (
            <div key={dia} className="bg-white rounded-2xl shadow-sm border border-[#f3e5d6] overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between bg-[#fff7ef] border-b border-[#f3e5d6]">
                <h2 className="font-bold text-[#b85c1a]">{dia}</h2>
                <button
                  onClick={() => limpiarDia(dia)}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  limpiar dia
                </button>
              </div>

              <div className="p-3 flex flex-col gap-3">
                <SlotCard
                  icon={<UtensilsCrossed size={15} />}
                  label="Comida"
                  slot={plan[dia].comida}
                  onOpen={(id) => navigate(`/receta/${id}`)}
                  onRemove={() => limpiarSlot(dia, 'comida')}
                />

                <SlotCard
                  icon={<MoonStar size={15} />}
                  label="Cena"
                  slot={plan[dia].cena}
                  onOpen={(id) => navigate(`/receta/${id}`)}
                  onRemove={() => limpiarSlot(dia, 'cena')}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#a07050] mt-4">
          Para añadir recetas al planificador, entra en una receta y pulsa "Planificar esta receta".
        </p>
      </div>

      {mostrarBusqueda && <BarraBusqueda onCerrar={() => setMostrarBusqueda(false)} />}
      <NavegacionInferior onToggleBusqueda={() => setMostrarBusqueda(true)} />
    </div>
  );
}

function SlotCard({ icon, label, slot, onOpen, onRemove }) {
  if (!slot) {
    return (
      <div className="rounded-xl border border-dashed border-[#e7c5a8] p-3 bg-[#fffbf7]">
        <div className="flex items-center gap-2 text-[#b85c1a] text-sm font-semibold">
          {icon}
          {label}
        </div>
        <p className="text-xs text-gray-400 mt-1">Sin receta asignada</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#f3e5d6] p-2.5 bg-white">
      <div className="flex items-center gap-2 text-[#b85c1a] text-sm font-semibold mb-2">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-3">
        <img src={slot.strMealThumb} alt={slot.strMeal} className="w-12 h-12 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#3d1a00] truncate">{slot.strMeal}</p>
          <p className="text-xs text-gray-400 truncate">{slot.strCategory || 'Receta'}</p>
        </div>
        <button
          onClick={() => onOpen(slot.idMeal)}
          className="text-[#E8631A] hover:text-[#cf4f10]"
          aria-label="Abrir receta"
        >
          <ArrowRight size={16} />
        </button>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500"
          aria-label="Quitar del planificador"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
