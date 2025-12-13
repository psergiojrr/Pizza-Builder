import { CreatePizzaBody, Ingredient, ListPizzasQuery, Pizza, Size, SizeId } from "@pizza/types"
import { Router } from "express"
import { sizes } from "../commons/sizes"
import { ingredients } from "../commons/ingredients"

const router = Router()

const sizesMap = new Map<SizeId, Size>(sizes.map(size => [size.id, size]))
const ingredientsMap = new Map<string, Ingredient>(ingredients.map(ingredient => [ingredient.id, ingredient]))
const pizzas: Pizza[] = []

router.post('/pizzas', (req, res) => {
  const { customerName, sizeId, ingredientIds } = req.body as CreatePizzaBody

  if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
    return res.status(400).json({ error: 'Invalid input: customerName is required and must be a non-empty string' })
  }

  const size = sizesMap.get(sizeId)
  if (!size) {
    return res.status(400).json({ error: `Invalid sizeId: ${sizeId}` })
  }

  if (!Array.isArray(ingredientIds)) {
    return res.status(400).json({ error: 'Invalid input: ingredientIds must be an array of strings' })
  }

  const invalidIngredientIds: string[] = []

  for (const id of ingredientIds) {
    if (!ingredientsMap.has(id)) {
      invalidIngredientIds.push(id)
    }
  }

  if (invalidIngredientIds.length > 0) {
    return res.status(400).json({ error: `Invalid ingredientIds: [${invalidIngredientIds.join(', ')}]` })
  }

  const selectedIngredients = ingredientIds.map(id => ingredientsMap.get(id)!)
  const finalPrice = size.basePrice + selectedIngredients.reduce((sum, i) => sum + i.extraPrice, 0)
  const pizza: Pizza = {
    id: (pizzas.length + 1).toString(),
    customerName,
    size,
    ingredients: selectedIngredients,
    finalPrice,
    createdAt: new Date().toISOString(),
  }
  pizzas.push(pizza)
  return res.status(201).json(pizza)
})

router.get('/pizzas', (req, res) => {
  const { customerName, sortBy, order } = req.query as ListPizzasQuery

  let result = [...pizzas]

  if (customerName && typeof customerName === 'string') {
    const customerQuerySearch = customerName.toLowerCase()
    result = result.filter(p => p.customerName.toLowerCase().includes(customerQuerySearch))
  }

  if (sortBy === 'finalPrice' || sortBy === 'createdAt') {
    const direction = order === 'desc' ? -1 : 1
    result.sort((a, b) => {
      if (sortBy === 'finalPrice') {
        return (a.finalPrice - b.finalPrice) * direction
      }
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction
    })
  }

  return res.status(200).json(result)
})

router.get('/pizzas/:id', (req, res) => {
  const pizza = pizzas.find(p => p.id === req.params.id)

  if (!pizza) {
    return res.status(404).json({ error: 'Pizza not found' })
  }

  return res.status(200).json(pizza)
})

export default router