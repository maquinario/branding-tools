import { SignUpController } from '../../../../presentation/controllers/auth/SignUp/SignUpController'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './SignUpValidationFactory'
import { makeDbAuthentication } from '../../usecases/authentication/DbAuthenticationFactory'
import { makeDbAddAccount } from '../../usecases/addAccount/DbAddAccountFactory'
import { makeLogControllerDecorator } from '../../decorators/LogControllerDecoratorFactory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(controller)
}
