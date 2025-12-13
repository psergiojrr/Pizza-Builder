import { Router } from "express"
import { SizesController } from "../controller/SizesController"

const router = Router()

router.get('/sizes', SizesController.getAllSizes)

export default router