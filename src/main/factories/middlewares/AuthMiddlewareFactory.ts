import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/AuthMiddleware'
import { makeDbLoadAccountByToken } from '../usecases/loadAccountByToken/DbLoadAccountByTokenFactory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
