import { Router } from "express"
import { HealthController } from "../controller/HealthController"

const router = Router()

router.get('/health', HealthController.checkHealth)

export default router