import { AddAccountRepository } from '@/data/protocols/db/Account/AddAccountRepository'
import { AddAccountModel } from '@/domain/usecases/AddAccount'
import { AccountModel } from '@/domain/models/Account'
import { MongoHelper } from '../helpers/MongoHelper'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/Account/LoadAccountByEmailRepository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/Account/LoadAccountByTokenRepository'

export class AccountMongoRepository
implements AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: id },
      { $set: { accessToken: token } }
    )
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account && MongoHelper.map(account)
  }
}
