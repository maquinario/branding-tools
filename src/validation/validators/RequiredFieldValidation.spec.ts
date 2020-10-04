import faker from 'faker'
import { RequiredFieldValidation } from './RequiredFieldValidation'
import { MissingParamError } from '@/presentation/errors'

const fieldName = faker.database.column()

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(fieldName)
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: faker.random.word() })
    expect(error).toEqual(new MissingParamError(fieldName))
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const field = {}
    field[fieldName] = faker.random.word()
    const error = sut.validate(field)
    expect(error).toBeFalsy()
  })
})
