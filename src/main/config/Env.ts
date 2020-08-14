export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/branding-tools',
  port: process.env.port || 5050,
  jwtSecret: process.env.JWT_SECRET || 'Ast!@18'
}
