import { SignUpController } from '@/presentation/controllers/auth/SignUp/SignUpController'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from './SignUpValidationFactory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/DbAuthenticationFactory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/addAccount/DbAddAccountFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/LogControllerDecoratorFactory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(controller)
}
