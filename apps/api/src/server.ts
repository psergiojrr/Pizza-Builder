import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

type SizeType = 'sm' | 'md' | 'lg'

interface ISizes {
  id: SizeType
  name: string
  basePrice: number
}

type Size = typeof sizes[number]
type Ingredient = typeof ingredients[number]

interface IPizza {
  id: string
  customerName: string
  size: Size
  ingredients: Ingredient[]
  finalPrice: number
  createdAt: string
}

interface IIngredients {
  id: string
  name: string
  extraPrice: number
}

//I was in doubt if id should be number or a uuid, so I choosed to use sm, md and lg as id
const sizes: ISizes[] = [
  { id: 'sm', name: 'Small', basePrice: 2000 },
  { id: 'md', name: 'Medium', basePrice: 3000 },
  { id: 'lg', name: 'Large', basePrice: 4000 },
]

//Like sizes, I was in doubt if id should be number or a uuid, so I choosed to use the ingredient name as id
const ingredients: IIngredients[] = [
  { id: 'cheese', name: 'Cheese', extraPrice: 500 },
  { id: 'pepperoni', name: 'Pepperoni', extraPrice: 700 },
  { id: 'olive', name: 'Olive', extraPrice: 300 },
]

const sizesMap = new Map<string, Size>(sizes.map(size => [size.id, size]))
const ingredientsMap = new Map<string, Ingredient>(ingredients.map(ingredient => [ingredient.id, ingredient]))
const pizzas: IPizza[] = []

app.get('/health', (_req, res) => res
  .status(200).
  json({ status: 'ok' }))
app.get('/sizes', (_req, res) => res
  .status(200)
  .json(sizes))
app.get('/ingredients', (_req, res) => res
  .status(200)
  .json(ingredients))

app.post('/pizzas', (req, res) => {
  const { customerName, sizeId, ingredientIds } = req.body
  
  if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
    return res.status(400).json({ error: 'Invalid input: customerName is required and must be a non-empty string' })
  }

  const size = sizesMap.get(sizeId)

  if (!size || typeof sizeId !== 'string') {
    return res.status(400).json({ error: `Invalid sizeId: ${sizeId}` })
  }

  if(!Array.isArray(ingredientIds)) {
    return  res.status(400).json({ error: 'Invalid input: ingredientIds must be an array of strings' })
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
  
  const ingredients = (ingredientIds).map(id => ingredientsMap.get(id)!)
  const finalPrice = size.basePrice + ingredients.reduce((sum, i) => sum + i.extraPrice, 0)
  const pizza: IPizza = {
    id: (pizzas.length + 1).toString(),
    customerName,
    size,
    ingredients,
    finalPrice,
    createdAt: new Date().toISOString(),
  }
  pizzas.push(pizza)
  return res.status(201).json(pizza)
})

app.get('/pizzas', (_req, res) => {
  //TODO: include search by optional query param
  //customerName : filter by customer name (contains, case‑insensitive).
  //sortBy : "finalPrice" or "createdAt" .
  //order : "asc" or "desc" .

  return res.status(200).json(pizzas)
})

app.get('/pizzas/:id', (req, res) => {
  const pizza = pizzas.find(p => p.id === req.params.id)

  if (!pizza) {
    return res.status(404).json({ error: 'Pizza not found' })
  }

  return res.status(200).json(pizza)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`API on http://localhost:${port}`))
