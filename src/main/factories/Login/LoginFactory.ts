import env from '../../config/Env'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'
import { LoginController } from '../../../presentation/controllers/Login/LoginController'
import { LogMongoRepository } from '../../../infra/db/mongodb/Log/LogMongoRepository'
import { DbAuthentication } from '../../../data/usecases/authentication/DbAuthentication'
import { makeLoginValidation } from './LoginValidationFactory'
import { AccountMongoRepository } from '../../../infra/db/mongodb/Account/AccountMongoRepository'
import { BcryptAdapter } from '../../../infra/cryptography/BcryptAdapter/BcryptAdapter'
import { JwtAdapter } from '../../../infra/cryptography/JwtAdapter/JwtAdapter'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(makeLoginValidation(), dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
