import { Router } from "express"
import { IngredientsController } from "../controller/IngredientsController"

const router = Router()

router.get('/ingredients', IngredientsController.getAllIngredients)

export default router