import { beforeEach, describe, expect, it } from 'vitest'
import { usePlanificadorStore } from './planificadorStore.js'

beforeEach(() => {
  usePlanificadorStore.getState().limpiarSemana()
  localStorage.clear()
})

describe('planificadorStore', () => {
  it('planifica una receta en un slot concreto', () => {
    usePlanificadorStore.getState().planificarReceta({
      dia: 'Lunes',
      tipo: 'comida',
      receta: {
        idMeal: '11',
        strMeal: 'Pasta',
        strMealThumb: 'thumb.jpg',
        strCategory: 'Cena',
      },
    })

    expect(usePlanificadorStore.getState().plan.Lunes.comida).toEqual({
      idMeal: '11',
      strMeal: 'Pasta',
      strMealThumb: 'thumb.jpg',
      strCategory: 'Cena',
    })
  })

  it('limpia un slot y la semana completa', () => {
    const state = usePlanificadorStore.getState()

    state.planificarReceta({
      dia: 'Martes',
      tipo: 'cena',
      receta: {
        idMeal: '22',
        strMeal: 'Tacos',
        strMealThumb: 'thumb.jpg',
        strCategory: 'Mexicana',
      },
    })
    state.limpiarSlot('Martes', 'cena')

    expect(usePlanificadorStore.getState().plan.Martes.cena).toBeNull()

    state.planificarReceta({
      dia: 'Viernes',
      tipo: 'comida',
      receta: {
        idMeal: '33',
        strMeal: 'Hamburguesa',
        strMealThumb: 'thumb.jpg',
        strCategory: 'Fast food',
      },
    })
    state.limpiarSemana()

    expect(usePlanificadorStore.getState().plan.Viernes.comida).toBeNull()
    expect(usePlanificadorStore.getState().plan.Martes.cena).toBeNull()
  })
})