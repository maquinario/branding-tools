import { MongoHelper } from '../infra/db/mongodb/helpers/MongoHelper'
import env from './config/Env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/App')).default
    app.listen(env.port, () => {
      console.log(`⚙ Server running at http://localhost:${env.port}!`)
    })
  })
  .catch(console.error)
