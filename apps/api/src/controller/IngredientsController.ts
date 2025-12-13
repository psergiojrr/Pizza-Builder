import { Request, Response } from "express"
import { ingredients } from "../commons/ingredients"

export class IngredientsController {
  static getAllIngredients(_req: Request, res: Response) {
    return res.status(200).json(ingredients)
  }
}