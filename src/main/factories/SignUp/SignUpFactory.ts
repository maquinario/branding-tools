import { SignUpController } from '../../../presentation/controllers/SignUp/SignUpController'
import { DbAddAccount } from '../../../data/usecases/addAccount/DbAddAccount'
import { BcryptAdapter } from '../../../infra/cryptography/BcryptAdapter/BcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/Account/AccountMongoRepository'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/Log/LogMongoRepository'
import { makeSignUpValidation } from './SignUpValidationFactory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, validationComposite)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
