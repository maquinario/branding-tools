import { Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controllers/auth/Login/LoginController'
import { makeLoginValidation } from './LoginValidationFactory'
import { makeDbAuthentication } from '../../usecases/authentication/DbAuthenticationFactory'
import { makeLogControllerDecorator } from '../../decorators/LogControllerDecoratorFactory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
