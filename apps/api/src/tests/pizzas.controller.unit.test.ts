import { PizzasController } from '../controller/PizzasController' 
import type { Request, Response } from 'express'

function mockReqRes(overrides?: Partial<Request>) {
  const req = ({ params: {}, body: {}, query: {}, ...overrides } as unknown) as Request
  const resJson = jest.fn()
  const resStatus = jest.fn(() => ({ json: resJson }))
  const res = ({ status: resStatus } as unknown) as Response
  return { req, res, resStatus, resJson }
}

describe('PizzasController (unit)', () => {
  let controller: PizzasController

  beforeEach(() => {
    controller = new PizzasController()
  })

  describe('createPizza', () => {
    it('returns 400 when customerName is invalid', () => {
      const { req, res, resStatus, resJson } = mockReqRes({
        body: { sizeId: 'md', ingredientIds: ['cheese'] },
      })

      controller.createPizza(req, res)
      expect(resStatus).toHaveBeenCalledWith(400)
      expect(resJson).toHaveBeenCalledWith({
        error: 'Invalid input: customerName is required and must be a non-empty string',
      })
    })

    it('returns 400 when sizeId is invalid', () => {
      const { req, res, resStatus, resJson } = mockReqRes({
        body: { customerName: 'Alice', sizeId: 'invalid-size', ingredientIds: ['cheese'] },
      })

      controller.createPizza(req, res)
      expect(resStatus).toHaveBeenCalledWith(400)
      expect(resJson).toHaveBeenCalledWith({ error: 'Invalid sizeId: invalid-size' })
    })

    it('returns 400 when ingredientIds is not an array', () => {
      const { req, res, resStatus, resJson } = mockReqRes({
        body: { customerName: 'Bob', sizeId: 'md', ingredientIds: 'cheese' as any },
      })

      controller.createPizza(req, res)
      expect(resStatus).toHaveBeenCalledWith(400)
      expect(resJson).toHaveBeenCalledWith({
        error: 'Invalid input: ingredientIds must be an array of strings',
      })
    })

    it('returns 400 when ingredientIds has unknown ids', () => {
      const { req, res, resStatus, resJson } = mockReqRes({
        body: { customerName: 'Carol', sizeId: 'md', ingredientIds: ['cheese', 'unknown-ingredient'] },
      })

      controller.createPizza(req, res)
      expect(resStatus).toHaveBeenCalledWith(400)
      expect(resJson).toHaveBeenCalledWith({
        error: 'Invalid ingredientIds: [unknown-ingredient]',
      })
    })

    it('creates pizza and returns 201 with payload', () => {
      const { req, res, resStatus, resJson } = mockReqRes({
        body: { customerName: 'Dave', sizeId: 'md', ingredientIds: ['cheese', 'tomato'] },
      })

      controller.createPizza(req, res)
      expect(resStatus).toHaveBeenCalledWith(201)
      expect(resJson).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String),
        customerName: 'Dave',
        size: expect.objectContaining({ id: 'md' }),
        ingredients: expect.arrayContaining([
          expect.objectContaining({ id: 'cheese' }),
          expect.objectContaining({ id: 'tomato' }),
        ]),
        finalPrice: expect.any(Number),
        createdAt: expect.any(String),
      }))
    })
  })

  describe('getPizzaById', () => {
    it('returns existing pizza', () => {
      const create = mockReqRes({
        body: { customerName: 'John Doe', sizeId: 'md', ingredientIds: ['cheese', 'tomato'] },
      })
      controller.createPizza(create.req, create.res)
      const created = create.resJson.mock.calls[0][0]

      const { req, res, resStatus, resJson } = mockReqRes({ params: { id: created.id } as any })
      controller.getPizzaById(req, res)
      expect(resStatus).toHaveBeenCalledWith(200)
      expect(resJson).toHaveBeenCalledWith(expect.objectContaining({ id: created.id, customerName: 'John Doe' }))
    })

    it('returns 404 when pizza not found', () => {
      const { req, res, resStatus, resJson } = mockReqRes({ params: { id: '9999' } as any })
      controller.getPizzaById(req, res)
      expect(resStatus).toHaveBeenCalledWith(404)
      expect(resJson).toHaveBeenCalledWith({ error: 'Pizza not found' })
    })
  })
})