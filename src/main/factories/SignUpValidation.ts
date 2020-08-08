import { ValidationComposite } from '../../presentation/helpers/validators/ValidationComposite'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/RequiredFieldValidation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/CompareFieldsValidation'
import { Validation } from '../../presentation/helpers/validators/Validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  return new ValidationComposite(validations)
}
