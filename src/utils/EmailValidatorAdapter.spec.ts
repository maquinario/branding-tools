import faker from 'faker'
import { EmailValidatorAdapter } from './EmailValidatorAdapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if EmailValidator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(faker.random.word())
    expect(isValid).toBe(false)
  })
  test('Should return true if EmailValidator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(faker.random.word())
    expect(isValid).toBe(true)
  })
})
