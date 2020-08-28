import { LoadAccountByToken } from '../../../domain/usecases/LoadAccountByToken'
import { AccountModel } from '../../../domain/models/Account'
import { Decrypter } from '../../protocols/cryptography/Decrypter'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)
    return new Promise(resolve => resolve(null))
  }
}
