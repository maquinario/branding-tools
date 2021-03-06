import faker from 'faker'
import { MongoHelper } from '../helpers/MongoHelper'

import { AccountMongoRepository } from './AccountMongoRepository'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Accoung Mongo Repository', () => {
  const accountData = {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    accessToken: faker.random.alphaNumeric(35),
    role: 'admin'
  }

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add(accountData)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(accountData.name)
      expect(account.email).toBe(accountData.email)
      expect(account.password).toBe(accountData.password)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(accountData)
      const account = await sut.loadByEmail(accountData.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(accountData.name)
      expect(account.email).toBe(accountData.email)
      expect(account.password).toBe(accountData.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(accountData.email)
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const { name, email, password } = accountData
      const res = await accountCollection.insertOne({ name, email, password })
      const fakeAccount = res.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      const token = faker.random.alphaNumeric(36)
      await sut.updateAccessToken(fakeAccount._id, token)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe(token)
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const { name, email, password, accessToken } = accountData
      await accountCollection.insertOne({ name, email, password, accessToken })
      const account = await sut.loadByToken(accountData.accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(accountData.name)
      expect(account.email).toBe(accountData.email)
      expect(account.password).toBe(accountData.password)
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(accountData)
      const account = await sut.loadByToken(accountData.accessToken, accountData.role)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(accountData.name)
      expect(account.email).toBe(accountData.email)
      expect(account.password).toBe(accountData.password)
    })

    test('Should return null if role is invalid', async () => {
      const sut = makeSut()
      const newAccount = { ...accountData, role: faker.name.jobTitle() }
      await accountCollection.insertOne(newAccount)
      const account = await sut.loadByToken(newAccount.accessToken, faker.name.jobTitle())
      expect(account).toBe(null)
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken(accountData.accessToken)
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(accountData)
      const account = await sut.loadByToken(accountData.accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(accountData.name)
      expect(account.email).toBe(accountData.email)
      expect(account.password).toBe(accountData.password)
    })
  })
})
