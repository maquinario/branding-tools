import { RequiredFieldValidation } from './RequiredFieldValidation'
import faker from 'faker'
import { MissingParamError } from '../../errors'

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const fieldName = faker.database.column()
    const sut = new RequiredFieldValidation(fieldName)
    const error = sut.validate({ name: faker.random.word() })
    expect(error).toEqual(new MissingParamError(fieldName))
  })
  test('Should not return if validation succeeds', () => {
    const fieldName = faker.database.column()
    const sut = new RequiredFieldValidation(fieldName)
    const field = {}
    field[fieldName] = faker.random.word()
    const error = sut.validate(field)
    expect(error).toBeFalsy()
  })
})
