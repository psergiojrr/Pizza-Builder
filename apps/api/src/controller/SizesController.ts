import { Request, Response } from "express"
import { sizes } from "../commons/sizes"

export class SizesController {
    static getAllSizes(_req: Request, res: Response) {
      return res.status(200).json(sizes)
    }
}