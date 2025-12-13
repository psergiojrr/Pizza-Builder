import { Router } from 'express'
import healthRoute from './healthRoute'
import sizeRoute from './sizeRoute'
import ingredientsRoute from './ingredientsRoute'
import pizzasRoute from './pizzasRoute'

const router = Router()

router.use(healthRoute)
router.use(sizeRoute)
router.use(ingredientsRoute)
router.use(pizzasRoute)

export default router
