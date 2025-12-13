import { Request, Response } from "express"
1
export class HealthController {
  static checkHealth(_req: Request, res: Response) {
    return res.status(200).json({ status: 'OK' })
  }
}