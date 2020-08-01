import faker from 'faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const password = faker.internet.password()
    await sut.encrypt(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })
})
