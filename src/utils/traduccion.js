// Traducción EN→ES / ES→EN usando la API gratuita MyMemory
// Las traducciones se guardan en localStorage para no repetir peticiones

const STORAGE_KEY = 'coockit_tr_v1';

function getCache() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function setCache(cache) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cache)); }
  catch { /* localStorage no disponible (modo privado estricto) */ }
}

async function translateChunk(text, langpair = 'en|es') {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseStatus === 200) return data.responseData.translatedText;
  throw new Error(`MyMemory error ${data.responseStatus}`);
}

// Divide texto largo en fragmentos ≤450 chars respetando párrafos y frases
function splitIntoChunks(text, max = 450) {
  if (text.length <= max) return [text];
  const chunks = [];
  const lines = text.split(/\n+/);
  let current = '';
  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.length > max) {
      const sentences = line.match(/[^.!?]+[.!?]*\s*/g) || [line];
      for (const s of sentences) {
        if ((current + s).length > max) {
          if (current.trim()) chunks.push(current.trim());
          current = s;
        } else {
          current += s;
        }
      }
    } else if ((current ? current + '\n' + line : line).length > max) {
      if (current.trim()) chunks.push(current.trim());
      current = line;
    } else {
      current = current ? `${current}\n${line}` : line;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text];
}

// Traduce texto de cualquier longitud (secuencial para respetar límites de la API)
async function translateLongText(text) {
  if (!text || !text.trim()) return text || '';
  if (text.length <= 450) return translateChunk(text);
  const chunks = splitIntoChunks(text);
  const results = [];
  for (const chunk of chunks) {
    results.push(await translateChunk(chunk));
  }
  return results.join('\n');
}

// ---------- API pública ----------

/** Traduce solo el título de una receta (caché por idMeal) */
export async function traducirTituloReceta(idMeal, titulo) {
  const cache = getCache();
  const key = `t_${idMeal}`;
  if (cache[key]) return cache[key];
  const result = await translateChunk(titulo);
  cache[key] = result;
  setCache(cache);
  return result;
}

/** Traduce un término corto (categoría, área…) — caché por valor del texto */
export async function traducirTermino(termino) {
  if (!termino) return termino;
  const cache = getCache();
  const key = `term_${termino}`;
  if (cache[key]) return cache[key];
  const result = await translateChunk(termino);
  cache[key] = result;
  setCache(cache);
  return result;
}

/** Traduce el término de búsqueda del usuario de ES→EN para consultar la API */
export async function traducirBusqueda(terminoEs) {
  if (!terminoEs || !terminoEs.trim()) return terminoEs;
  const cache = getCache();
  const key = `sq_${terminoEs.toLowerCase().trim()}`;
  if (cache[key]) return cache[key];
  const result = await translateChunk(terminoEs, 'es|en').catch(() => terminoEs);
  cache[key] = result;
  setCache(cache);
  return result;
}

/**
 * Traduce una receta completa: título, instrucciones, ingredientes, categoría y área.
 * Almacena en caché por idMeal.
 */
export async function traducirRecetaCompleta(receta) {
  const cache = getCache();
  const cacheKey = `full_${receta.idMeal}`;
  if (cache[cacheKey]) return { ...receta, ...cache[cacheKey] };

  // Claves de ingredientes con valor
  const ingredientKeys = [];
  for (let i = 1; i <= 20; i++) {
    const nombre = receta[`strIngredient${i}`];
    if (nombre && nombre.trim()) ingredientKeys.push(`strIngredient${i}`);
  }

  const promesas = [
    translateChunk(receta.strMeal || '').catch(() => receta.strMeal),
    translateLongText(receta.strInstructions || '').catch(() => receta.strInstructions),
    receta.strCategory
      ? translateChunk(receta.strCategory).catch(() => receta.strCategory)
      : Promise.resolve(receta.strCategory),
    receta.strArea
      ? translateChunk(receta.strArea).catch(() => receta.strArea)
      : Promise.resolve(receta.strArea),
    ...ingredientKeys.map(k => translateChunk(receta[k]).catch(() => receta[k])),
  ];

  const resultados = await Promise.all(promesas);

  const traducido = {
    strMeal: resultados[0],
    strInstructions: resultados[1],
    strCategory: resultados[2],
    strArea: resultados[3],
  };

  ingredientKeys.forEach((k, i) => {
    traducido[k] = resultados[4 + i];
  });

  // Poblar también los cachés más granulares para que las tarjetas ya tengan la traducción
  if (resultados[0]) cache[`t_${receta.idMeal}`] = resultados[0];
  if (resultados[2] && receta.strCategory) cache[`term_${receta.strCategory}`] = resultados[2];
  if (resultados[3] && receta.strArea) cache[`term_${receta.strArea}`] = resultados[3];

  cache[cacheKey] = traducido;
  setCache(cache);
  return { ...receta, ...traducido };
}
