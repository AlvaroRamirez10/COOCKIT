# Informe: Funcionalidad "Imprimir" en Lista de Compra

Resumen: se añade un botón `Imprimir` en la página `PaginaListaCompra` que genera un PDF descargable con un resumen calculado y la lista completa de ingredientes.

1) Qué calcula el PDF

- `Total items`: número total de entradas en la lista.
- `Pendientes`: número de items no marcados como comprados.
- `Comprados`: número de items marcados como comprados.
- `Recetas distintas`: número de recetas diferentes que originan los items.

2) Formato del PDF

- Cabecera con título y campos calculados.
- Tabla simple: columnas `Producto`, `Cantidad`, `Receta`.
- Nombre de archivo: `lista_compra_YYYY-MM-DD.pdf`.

Ahora el PDF incluye estilo mejorado:

- Cabecera coloreada con el nombre del proyecto y la fecha.
- Caja de resumen con los totales calculados.
- Tabla con filas alternadas (rayada) y cabecera con color corporativo.
- Pie de página con numeración.

3) Implementación técnica

- Biblioteca usada: `jspdf`.
- Archivo modificado: `src/pages/PaginaListaCompra.jsx`.
- Funciones principales:
  - `generarResumen(items)`: calcula totales.
  - `formatearCantidad(cantidad)`: texto por defecto si no hay cantidad.
  - Callback del botón `Imprimir`: crea el `jsPDF`, escribe cabecera y filas, y llama a `doc.save()`.

4) Cómo probarlo localmente

1. Arranca la app:

```bash
npm install
npm run dev
```

2. Abre `http://localhost:5173/` y navega a la `Lista de compra`.

3. Añade ingredientes desde cualquier receta (o rellena el localStorage con items).

4. Pulsa el botón `Imprimir`. El navegador descargará el PDF.

5) Posibles mejoras

- Agrupar ingredientes iguales y sumar cantidades para un total por ingrediente.
- Incluir código de barras o QR con referencia.
- Mejorar el layout con tablas y márgenes más cuidada usando `autoTable`.

6) Seguridad y privacidad

El PDF se genera en el cliente; no se envía nada al servidor. Si la lista contiene datos sensibles, tenlo en cuenta antes de compartir el PDF.

---

Si quieres que prepare también una versión impresa estilo factura (con logo y estilos), lo hago y la dejo lista para elegir entre ambas.