import faker from 'faker'
import request from 'supertest'
import app from '../config/App'
import { MongoHelper } from '../../infra/db/mongodb/helpers/MongoHelper'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
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
})
