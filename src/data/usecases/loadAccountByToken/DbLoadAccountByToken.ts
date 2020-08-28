import { LoadAccountByToken } from '../../../domain/usecases/LoadAccountByToken'
import { AccountModel } from '../../../domain/models/Account'
import { Decrypter } from '../../protocols/cryptography/Decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/Account/LoadAccountByTokenRepository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return new Promise(resolve => resolve(null))
  }
}
