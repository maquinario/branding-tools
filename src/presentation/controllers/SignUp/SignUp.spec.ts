import faker from 'faker'
import { SignUpController } from './SignUp'
import {
  MissingParamError,
  ServerError
} from '../../errors'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Validation
} from './SignUpProtocols'
import { ok, badRequest, serverError } from '../../helpers/Http/HttpHelper'
import { HttpRequest } from '../../protocols'

const account = {
  id: faker.random.uuid(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: faker.internet.password()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => {
  const request = {
    body: {
      ...account,
      passwordConfirmation: account.password
    }
  }
  delete request.body.id
  return request
}

const makeFakeAccount = (): AccountModel => {
  const { body } = makeFakeRequest()
  delete body.passwordConfirmation
  const accountData = Object.assign({ ...body }, { id: account.id })
  return accountData
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(faker.random.words(3))))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request = makeFakeRequest()
    await sut.handle(request)
    delete request.body.passwordConfirmation
    expect(addSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeRequest()
    await sut.handle(request)
    delete request.body.passwordConfirmation
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
