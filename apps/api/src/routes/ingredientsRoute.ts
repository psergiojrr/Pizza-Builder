import { Router } from "express"
import { ingredients } from "../commons/ingredients"

const router = Router()

router.get('/ingredients', (_req, res) => res
  .status(200)
  .json(ingredients))

export default router