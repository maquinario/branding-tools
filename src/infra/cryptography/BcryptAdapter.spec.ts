import faker from 'faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

const password = faker.internet.password()
const hash = faker.random.alphaNumeric(24)

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve(hash))
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
    await sut.hash(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const password = faker.internet.password()
    const hash = await sut.hash(password)
    expect(hash).toBe(hash)
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
    await sut.compare(password, hash)
    expect(compareSpy).toHaveBeenCalledWith(password, hash)
  })

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare(password, hash)
    expect(isValid).toBe(true)
  })

  test('Should return false when compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(
      new Promise(resolve => resolve(false))
    )
    const isValid = await sut.compare(password, hash)
    expect(isValid).toBe(false)
  })

  test('Should throw if compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.compare(password, hash)
    await expect(promise).rejects.toThrow()
  })
})
