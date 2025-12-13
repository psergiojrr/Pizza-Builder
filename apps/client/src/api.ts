import type { Size, Ingredient, Pizza, CreatePizzaBody, ListPizzasQuery } from '@pizza/types'

const API_BASE_URL = 'http://localhost:8080'

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'An unknown error occurred' }))
    throw new Error(errorBody.error || 'Failed to fetch data')
  }
  return response.json()
}

export const getSizes = () => fetcher<Size[]>('/sizes')

export const getIngredients = () => fetcher<Ingredient[]>('/ingredients')

export const createPizza = (body: CreatePizzaBody) => fetcher<Pizza>('/pizzas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const listPizzas = (query: ListPizzasQuery = {}) => {
  const params = new URLSearchParams(query as Record<string, string>)
  return fetcher<Pizza[]>(`/pizzas?${params.toString()}`)
}

export const getPizzaById = (id: string) => fetcher<Pizza>(`/pizzas/${id}`)
