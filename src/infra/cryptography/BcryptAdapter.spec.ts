import faker from 'faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

const hashString = faker.random.alphaNumeric(36)
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve(hashString))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const password = faker.internet.password()
    await sut.encrypt(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const password = faker.internet.password()
    const hash = await sut.encrypt(password)
    expect(hash).toBe(hashString)
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const password = faker.internet.password()
    const promise = sut.encrypt(password)
    await expect(promise).rejects.toThrow()
  })
})
