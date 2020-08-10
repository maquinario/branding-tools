import faker from 'faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

const hashString = faker.random.alphaNumeric(36)
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve(hashString))
  },
  async compare (): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const password = faker.internet.password()
    await sut.hash(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const password = faker.internet.password()
    const hash = await sut.hash(password)
    expect(hash).toBe(hashString)
  })

  test('Should throw if hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const password = faker.internet.password()
    const promise = sut.hash(password)
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    const password = faker.internet.password()
    const hashedPassword = faker.random.alphaNumeric(24)
    await sut.compare(password, hashedPassword)
    expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword)
  })
})
