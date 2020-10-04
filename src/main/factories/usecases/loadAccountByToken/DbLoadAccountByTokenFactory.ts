import { LoadAccountByToken } from '@/domain/usecases/LoadAccountByToken'
import { DbLoadAccountByToken } from '@/data/usecases/loadAccountByToken/DbLoadAccountByToken'
import { AccountMongoRepository } from '@/infra/db/mongodb/Account/AccountMongoRepository'
import { JwtAdapter } from '@/infra/cryptography/JwtAdapter/JwtAdapter'
import env from '@/main/config/Env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
