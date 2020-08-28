import { AccountMongoRepository } from '../../../../../infra/db/mongodb/Account/AccountMongoRepository'
import { BcryptAdapter } from '../../../../../infra/cryptography/BcryptAdapter/BcryptAdapter'
import { AddAccount } from '../../../../../domain/usecases/AddAccount'
import { DbAddAccount } from '../../../../../data/usecases/addAccount/DbAddAccount'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
