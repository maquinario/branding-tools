import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './DbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher
  private readonly addAccountRepository: AddAccountRepository
  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
