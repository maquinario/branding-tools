import faker from 'faker'
import request from 'supertest'
import { hash } from 'bcrypt'
import app from '../config/App'
import { MongoHelper } from '../../infra/db/mongodb/helpers/MongoHelper'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      const password = faker.internet.password()
      await request(app)
        .post('/api/signup')
        .send({
          name: faker.name.firstName(),
          email: faker.internet.email(),
          password,
          passwordConfirmation: password
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@tester.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'bruno@tester.com',
          password: '123'
        })
        .expect(200)
    })
  })
})
