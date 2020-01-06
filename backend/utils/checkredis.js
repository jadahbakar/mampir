require('dotenv').config()
const redis = require('redis')
const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
)

module.exports = function (msg) {
  client.get(msg, function (error, result) {
    if (error) {
      console.log(error)
      throw error
    }
    console.log('GET result ->' + result)
    // result
    process.exit(1)
  })
}
