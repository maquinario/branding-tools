import { SignUpController } from '../../../../../presentation/controllers/auth/SignUp/SignUpController'
import { Controller } from '../../../../../presentation/protocols'
import { makeSignUpValidation } from './SignUpValidationFactory'
import { makeDbAuthentication } from '../../../usecases/account/authentication/DbAuthenticationFactory'
import { makeDbAddAccount } from '../../../usecases/account/addAccount/DbAddAccountFactory'
import { makeLogControllerDecorator } from '../../../decorators/LogControllerDecoratorFactory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(controller)
}
