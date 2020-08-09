import { Validation } from '../../protocols/Validation'
import { InvalidParamError } from '../../errors'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToComparename: string
  constructor (fieldName: string, fieldToComparename: string) {
    this.fieldName = fieldName
    this.fieldToComparename = fieldToComparename
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToComparename]) {
      return new InvalidParamError(this.fieldToComparename)
    }
  }
}
