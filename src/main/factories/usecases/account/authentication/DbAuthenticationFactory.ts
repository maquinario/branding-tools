import env from '@/main/config/Env'
import { DbAuthentication } from '@/data/usecases/authentication/DbAuthentication'
import { AccountMongoRepository } from '@/infra/db/mongodb/Account/AccountMongoRepository'
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter/BcryptAdapter'
import { JwtAdapter } from '@/infra/cryptography/JwtAdapter/JwtAdapter'
import { Authentication } from '@/domain/usecases/Authentication'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
