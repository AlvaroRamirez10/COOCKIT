import { beforeEach, describe, expect, it, vi } from 'vitest'
import { traducirBusqueda, traducirRecetaCompleta, traducirTermino } from './traduccion.js'

const buildResponse = (translatedText) => ({
  responseStatus: 200,
  responseData: { translatedText },
})

beforeEach(() => {
  localStorage.clear()
})

describe('traduccion', () => {
  it('traduce y reutiliza la caché para búsquedas', async () => {
    const fetchMock = vi.fn(async (url) => {
      const parsed = new URL(url)
      const query = parsed.searchParams.get('q') || ''
      const langpair = parsed.searchParams.get('langpair') || ''

      return {
        json: async () => buildResponse(`${langpair}:${decodeURIComponent(query)}`),
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    const primera = await traducirBusqueda('pollo asado')
    const segunda = await traducirBusqueda('pollo asado')

    expect(primera).toBe('es|en:pollo asado')
    expect(segunda).toBe('es|en:pollo asado')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toContain('langpair=es|en')
  })

  it('traduce una receta completa y guarda cachés auxiliares', async () => {
    const fetchMock = vi.fn(async (url) => {
      const parsed = new URL(url)
      const query = parsed.searchParams.get('q') || ''
      const langpair = parsed.searchParams.get('langpair') || ''

      return {
        json: async () => buildResponse(`${langpair}:${decodeURIComponent(query)}`),
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    const receta = {
      idMeal: '1234',
      strMeal: 'Ensalada fresca',
      strInstructions: `${'Paso uno. '.repeat(30)}Paso final.`,
      strCategory: 'Starter',
      strArea: 'Spanish',
      strIngredient1: 'Tomate',
      strIngredient2: 'Aceite de oliva',
      strIngredient3: '',
    }

    const traducida = await traducirRecetaCompleta(receta)

    expect(traducida.strMeal).toBe('en|es:Ensalada fresca')
    expect(traducida.strCategory).toBe('en|es:Starter')
    expect(traducida.strArea).toBe('en|es:Spanish')
    expect(traducida.strIngredient1).toBe('en|es:Tomate')
    expect(traducida.strIngredient2).toBe('en|es:Aceite de oliva')
    expect(traducida.strInstructions).toContain('en|es:')
    expect(localStorage.getItem('coockit_tr_v1')).toContain('full_1234')
    expect(localStorage.getItem('coockit_tr_v1')).toContain('t_1234')
    expect(localStorage.getItem('coockit_tr_v1')).toContain('term_Starter')
    expect(localStorage.getItem('coockit_tr_v1')).toContain('term_Spanish')
    expect(fetchMock.mock.calls.length).toBeGreaterThan(4)
  })

  it('devuelve el término original cuando está vacío', async () => {
    vi.stubGlobal('fetch', vi.fn())

    expect(await traducirTermino('')).toBe('')
    expect(await traducirBusqueda('   ')).toBe('   ')
  })
})