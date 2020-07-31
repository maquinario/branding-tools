import faker from 'faker'
import validator from 'validator'
import { EmailValidatorAdapter } from './EmailValidatorAdapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('Should return false if EmailValidator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid(faker.random.word())
    expect(isValid).toBe(false)
  })
  test('Should return true if EmailValidator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(faker.internet.email())
    expect(isValid).toBe(true)
  })
})
