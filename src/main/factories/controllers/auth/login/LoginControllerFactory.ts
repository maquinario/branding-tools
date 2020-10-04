import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/auth/Login/LoginController'
import { makeLoginValidation } from './LoginValidationFactory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/DbAuthenticationFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/LogControllerDecoratorFactory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
