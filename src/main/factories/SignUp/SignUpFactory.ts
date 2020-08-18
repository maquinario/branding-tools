import env from '../../config/Env'
import { SignUpController } from '../../../presentation/controllers/SignUp/SignUpController'
import { DbAddAccount } from '../../../data/usecases/addAccount/DbAddAccount'
import { BcryptAdapter } from '../../../infra/cryptography/BcryptAdapter/BcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/Account/AccountMongoRepository'
import { DbAuthentication } from '../../../data/usecases/authentication/DbAuthentication'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/Log/LogMongoRepository'
import { makeSignUpValidation } from './SignUpValidationFactory'
import { JwtAdapter } from '../../../infra/cryptography/JwtAdapter/JwtAdapter'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, validationComposite, dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
