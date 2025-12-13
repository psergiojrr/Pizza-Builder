export type SizeId = 'sm' | 'md' | 'lg'

export interface Size {
  id: SizeId
  name: string
  basePrice: number
}

export interface Ingredient {
  id: string
  name: string
  extraPrice: number
}

export interface Pizza {
  id: string
  customerName: string
  size: Size
  ingredients: Ingredient[]
  finalPrice: number
  createdAt: string
}

export interface CreatePizzaBody {
  customerName: string
  sizeId: SizeId
  ingredientIds: string[]
}

export interface ListPizzasQuery {
  customerName?: string
  sortBy?: 'finalPrice' | 'createdAt'
  order?: 'asc' | 'desc'
}
