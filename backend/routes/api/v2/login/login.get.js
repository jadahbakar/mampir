var auth = require('../authentication')
var asyncro = require('../asyncro')
// const CryptoJS = require('crypto-js')

var redis = require('redis')
var clientRedis = redis.createClient()

// function decrypt (transitmessage, pass) {
//   var keySize = 256
//   var ivSize = 128
//   var iterations = 100
//   var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32))
//   var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
//   var encrypted = transitmessage.substring(64)

//   var key = CryptoJS.PBKDF2(pass, salt, {
//     keySize: keySize / 32,
//     iterations: iterations
//   })

//   var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
//     iv: iv,
//     padding: CryptoJS.pad.Pkcs7,
//     mode: CryptoJS.mode.CBC
//   })
//   return decrypted
// }

async function createRedis (token) {
  clientRedis.set(token, token)
}

const getLogin = asyncro.asyncHandler(async (request, response, next) => {
  const payload = {
    initial: process.env.INIT_STARTUP,
    reqIp: request.connection.remoteAddress // ---ambil ip Address client
  }
  const token = auth.createJWToken({
    sessionData: payload,
    maxAge: process.env.MAX_AGE_LOGIN
  })
  createRedis(token)
  response.json({ token })
})

module.exports = {
  getLogin: getLogin
}
