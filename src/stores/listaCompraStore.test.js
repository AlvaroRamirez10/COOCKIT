import { beforeEach, describe, expect, it } from 'vitest'
import { useListaCompraStore } from './listaCompraStore.js'

const recetaBase = {
  strMeal: 'Receta de prueba',
  strIngredient1: 'Tomate',
  strMeasure1: '1 kg',
  strIngredient2: 'Sal',
  strMeasure2: '1 cdita',
  strIngredient3: 'Aceite',
  strMeasure3: '2 cda',
}

beforeEach(() => {
  useListaCompraStore.setState({ items: [] })
  localStorage.clear()
})

describe('listaCompraStore', () => {
  it('agrega ingredientes nuevos y fusiona duplicados', () => {
    useListaCompraStore.setState({
      items: [
        { id: '1', nombre: 'Tomate', cantidad: '500 g', receta: 'Tortilla', comprado: false },
      ],
    })

    const resultado = useListaCompraStore.getState().agregarDesdeReceta(recetaBase)

    const items = useListaCompraStore.getState().items
    const tomate = items.find((item) => item.nombre === 'Tomate')

    expect(resultado).toEqual({ agregados: 2, actualizados: 1 })
    expect(items).toHaveLength(3)
    expect(tomate.cantidad).toBe('500 g + 1 kg')
    expect(tomate.receta).toBe('Tortilla · Receta de prueba')
  })

  it('marca, limpia y elimina elementos', () => {
    useListaCompraStore.setState({
      items: [{ id: 'a', nombre: 'Sal', cantidad: '1 cdita', receta: 'Receta', comprado: false }],
    })

    useListaCompraStore.getState().alternarComprado('a')
    expect(useListaCompraStore.getState().items[0].comprado).toBe(true)

    useListaCompraStore.getState().limpiarComprados()
    expect(useListaCompraStore.getState().items).toHaveLength(0)

    useListaCompraStore.getState().agregarDesdeReceta({ strMeal: 'Base', strIngredient1: 'Pasta', strMeasure1: '200 g' })
    const itemId = useListaCompraStore.getState().items[0].id
    useListaCompraStore.getState().eliminarItem(itemId)
    expect(useListaCompraStore.getState().items).toHaveLength(0)
  })
})