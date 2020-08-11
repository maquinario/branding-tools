import { Validation } from '../../protocols/Validation'
import { InvalidParamError } from '../../errors'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToComparename: string
  ) {}

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToComparename]) {
      return new InvalidParamError(this.fieldToComparename)
    }
  }
}
