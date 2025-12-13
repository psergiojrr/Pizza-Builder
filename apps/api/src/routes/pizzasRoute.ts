import { Router } from "express"
import { PizzasController } from "../controller/PizzasController"

const router = Router()

const pizzasController = new PizzasController()

router.post('/pizzas', pizzasController.createPizza)
router.get('/pizzas', pizzasController.getAllPizzas)
router.get('/pizzas/:id', pizzasController.getPizzaById)

export default router