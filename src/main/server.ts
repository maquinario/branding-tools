import 'module-alias/register'
import env from './config/Env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/App')).default
    app.listen(env.port, () => {
      console.log('⚙ Server running!')
    })
  })
  .catch(console.error)
