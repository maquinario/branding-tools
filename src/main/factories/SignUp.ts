import { SignUpController } from '../../presentation/controllers/SignUp/SignUp'
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter'
import { DbAddAccount } from '../../data/usecases/addAccount/DbAddAccount'
import { BcryptAdapter } from '../../infra/cryptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/AccountRepository/Account'
import { LogControllerDecorator } from '../decorators/Log'
import { Controller } from '../../presentation/protocols'
import { LogMongoRepository } from '../../infra/db/mongodb/LogRepository/Log'
import { makeSignUpValidation } from './SignUpValidation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, validationComposite)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
