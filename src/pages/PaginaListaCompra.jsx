import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, ListPlus, ShoppingCart, Printer } from 'lucide-react';
import { useListaCompraStore } from '../stores/listaCompraStore';
import NavegacionInferior from '../components/NavegacionInferior';
import BarraBusqueda from '../components/BarraBusqueda';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function generarResumen(items) {
  const total = items.length;
  const comprados = items.filter(i => i.comprado).length;
  const pendientes = total - comprados;
  const recetas = Array.from(new Set(items.map(i => i.receta))).length;
  return { total, comprados, pendientes, recetas };
}

function formatearCantidad(cantidad) {
  return cantidad && cantidad.trim() ? cantidad : 'Cantidad al gusto';
}

export default function PaginaListaCompra() {
  const { items, alternarComprado, eliminarItem, limpiarComprados, limpiarTodo } = useListaCompraStore();
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  const pendientes = items.filter((i) => !i.comprado).length;
  const comprados = items.length - pendientes;

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
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Lista de compra</h1>
            <p className="text-white/70 text-sm">{pendientes} pendientes · {comprados} comprados</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <ShoppingCart className="text-white" size={22} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-5">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <ListPlus size={28} className="mx-auto text-[#E8631A] mb-2" />
            <p className="font-semibold text-[#3d1a00]">Tu lista está vacía</p>
            <p className="text-sm text-gray-500 mt-1">
              Entra a una receta y pulsa "Añadir ingredientes a mi lista".
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={limpiarComprados}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E8631A]/20 text-[#b85c1a] hover:bg-[#fff6ee]"
              >
                Limpiar comprados
              </button>
              <button
                onClick={limpiarTodo}
                className="text-xs px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
              >
                Vaciar lista
              </button>
              <button
                onClick={async () => {
                  try {
                    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
                  const pageWidth = doc.internal.pageSize.getWidth();
                  const resumen = generarResumen(items);

                  // Header
                  doc.setFillColor(232, 99, 26);
                  doc.rect(0, 0, pageWidth, 70, 'F');
                  doc.setTextColor(255, 255, 255);
                  doc.setFontSize(18);
                  doc.text('Coockit — Lista de compra', 40, 45);
                  doc.setFontSize(10);
                  doc.text(`Fecha: ${new Date().toLocaleString()}`, pageWidth - 200, 45);

                  // Summary box
                  doc.setDrawColor(200);
                  doc.setFillColor(255, 255, 255);
                  doc.roundedRect(40, 80, pageWidth - 80, 48, 6, 6, 'F');
                  doc.setTextColor(0, 0, 0);
                  doc.setFontSize(11);
                  doc.text(`Total items: ${resumen.total}`, 56, 102);
                  doc.text(`Pendientes: ${resumen.pendientes}`, 200, 102);
                  doc.text(`Comprados: ${resumen.comprados}`, 340, 102);
                  doc.text(`Recetas distintas: ${resumen.recetas}`, 460, 102);

                  // Table using autoTable
                  const body = items.map(it => [String(it.nombre), formatearCantidad(it.cantidad), String(it.receta)]);

                  doc.autoTable({
                    head: [['Producto', 'Cantidad', 'Receta']],
                    body,
                    startY: 150,
                    theme: 'striped',
                    headStyles: { fillColor: [232, 99, 26], textColor: 255, halign: 'center' },
                    styles: { fontSize: 10, cellPadding: 6 },
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                    columnStyles: {
                      0: { cellWidth: 240 },
                      1: { cellWidth: 110 },
                      2: { cellWidth: 130 },
                    },
                    didDrawPage: (data) => {
                      // Footer
                      const pageCount = doc.getNumberOfPages();
                      doc.setFontSize(9);
                      doc.setTextColor(150);
                      const footer = `Página ${doc.internal.getCurrentPageInfo().pageNumber} / ${pageCount}`;
                      doc.text(footer, pageWidth - 80, doc.internal.pageSize.getHeight() - 30);
                    },
                  });

                  const fileName = `lista_compra_${new Date().toISOString().slice(0,10)}.pdf`;
                  doc.save(fileName);
                  // Indicar éxito al usuario
                  try {
                    // eslint-disable-next-line no-alert
                    alert(`PDF generado: ${fileName}`);
                  } catch {}
                } catch (err) {
                  // Mostrar y loggear el error para depuración en el navegador
                  // eslint-disable-next-line no-console
                  console.error('Error generando PDF:', err);
                  try {
                    // eslint-disable-next-line no-alert
                    alert('Error al generar el PDF. Abre la consola del navegador para más detalles.');
                  } catch {}
                }
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E8631A]/20 text-[#b85c1a] hover:bg-[#fff6ee] flex items-center gap-2"
              >
                <Printer size={14} /> Imprimir
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 ${idx !== items.length - 1 ? 'border-b border-[#f3e5d6]' : ''}`}
                >
                  <button onClick={() => alternarComprado(item.id)} className="text-[#E8631A]">
                    {item.comprado ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${item.comprado ? 'line-through text-gray-400' : 'text-[#3d1a00]'}`}>
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.cantidad || 'Cantidad al gusto'} · {item.receta}
                    </p>
                  </div>

                  <button
                    onClick={() => eliminarItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Eliminar item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {mostrarBusqueda && <BarraBusqueda onCerrar={() => setMostrarBusqueda(false)} />}
      <NavegacionInferior onToggleBusqueda={() => setMostrarBusqueda(true)} />
    </div>
  );
}
