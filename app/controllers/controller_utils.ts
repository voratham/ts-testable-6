import * as Express from 'express'

export type ValidationResult<T> = {
  error: string | null;
  validatedInput: T;
}

export type Controller<TIn, TOut> = {
  validator: (input: any) => ValidationResult<TIn>;
  handler: (TIn) => Promise<TOut>;
  view: (output: TOut) => unknown;
}

export type ExpressHandler = (req: Express.Request, res: Express.Response) => Promise<unknown>

export function createExpressHandler<TIn, TOut>(controller: Controller<TIn, TOut>): ExpressHandler {
  return async (req: Express.Request, res: Express.Response): Promise<unknown> => {
    const validateResult = controller.validator(req.body)
    if (validateResult.error) {
      return res.status(422).send({ error: validateResult.error })
    }
    const result = await controller.handler(validateResult.validatedInput)
    return res.json(controller.view(result))
  }
}
