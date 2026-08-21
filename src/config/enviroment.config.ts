export const EnviromentConfig = {
  port: process.env.PORT,
  mongodb: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiredIn: process.env.JWT_EXPIRED_IN,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}
