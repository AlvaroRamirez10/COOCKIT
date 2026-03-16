const BASE = 'https://www.themealdb.com/api/json/v1/1';

export const apiRecetas = {

  // Obtiene TODAS las recetas disponibles cargando por cada letra del abecedario
  obtenerTodas: async () => {
    const letras = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const peticiones = letras.map(letra =>
      fetch(`${BASE}/search.php?f=${letra}`)
        .then(r => r.json())
        .then(data => data.meals || [])
        .catch(() => [])
    );
    const resultados = await Promise.all(peticiones);
    // Aplanar el array y eliminar duplicados por idMeal
    const todas = resultados.flat();
    const unicas = Array.from(new Map(todas.map(r => [r.idMeal, r])).values());
    return unicas;
  },

  // Obtiene recetas destacadas para la pantalla de inicio (muestra variedad por categorías)
  obtenerDestacadas: async () => {
    const categorias = await apiRecetas.obtenerCategorias();
    // Coge hasta 12 categorías aleatoriamente
    const seleccion = categorias
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);

    const peticiones = seleccion.map(cat =>
      fetch(`${BASE}/filter.php?c=${encodeURIComponent(cat.strCategory)}`)
        .then(r => r.json())
        .then(data => data.meals || [])
        .catch(() => [])
    );

    const resultados = await Promise.all(peticiones);
    const todas = resultados.flat();
    // Eliminar duplicados y mezclar aleatoriamente
    const unicas = Array.from(new Map(todas.map(r => [r.idMeal, r])).values());
    return unicas.sort(() => Math.random() - 0.5);
  },

  // Búsqueda por nombre
  buscarPorNombre: async (nombre) => {
    const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(nombre)}`);
    const data = await res.json();
    return data.meals || [];
  },

  // Búsqueda por categoría
  buscarPorCategoria: async (categoria) => {
    const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(categoria)}`);
    const data = await res.json();
    return data.meals || [];
  },

  // Búsqueda por origen/área
  buscarPorOrigen: async (origen) => {
    const res = await fetch(`${BASE}/filter.php?a=${encodeURIComponent(origen)}`);
    const data = await res.json();
    return data.meals || [];
  },

  // Obtener todas las categorías
  obtenerCategorias: async () => {
    const res = await fetch(`${BASE}/categories.php`);
    const data = await res.json();
    return data.categories || [];
  },

  // Obtener todos los orígenes
  obtenerOrigenes: async () => {
    const res = await fetch(`${BASE}/list.php?a=list`);
    const data = await res.json();
    return data.meals || [];
  },

  // Obtener receta por ID
  obtenerPorId: async (id) => {
    const res = await fetch(`${BASE}/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals?.[0] || null;
  },
};