import faker from 'faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

const hashString = faker.random.alphaNumeric(36)
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve(hashString))
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const password = faker.internet.password()
    await sut.encrypt(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })

  test('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const password = faker.internet.password()
    const hash = await sut.encrypt(password)
    expect(hash).toBe(hashString)
  })
})
