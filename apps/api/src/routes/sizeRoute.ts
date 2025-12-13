import { Router } from "express"
import { sizes } from "../commons/sizes"

const router = Router()

router.get('/sizes', (_req, res) => res
  .status(200)
  .json(sizes))

export default router