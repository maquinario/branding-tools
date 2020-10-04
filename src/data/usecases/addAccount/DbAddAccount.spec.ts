import faker from 'faker'
import { DbAddAccount } from './DbAddAccount'
import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './DbAddAccountProtocols'

const hashedPassword = faker.random.alphaNumeric(36)

const fakeAccount = {
  id: faker.random.uuid(),
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: hashedPassword
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise((resolve) => resolve(hashedPassword))
    }
  }
  return new HasherStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeRequest = (): AccountModel => {
  const request = { ...fakeAccount }
  delete request.id
  return request
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeRequest()
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accountData = makeRequest()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeRequest()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accountData = makeRequest()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const newAccount = makeRequest()
    const account = await sut.add(newAccount)
    expect(account).toEqual(fakeAccount)
  })

  test('Should return null if LoadAccountByEmailRepository does not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeAccount)))
    const newAccount = makeRequest()
    const account = await sut.add(newAccount)
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeRequest())
    expect(loadSpy).toHaveBeenCalledWith(fakeAccount.email)
  })
})
