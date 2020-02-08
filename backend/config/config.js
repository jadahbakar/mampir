
// requires
const _ = require('lodash')

// module variables
const configJson = require('./config.json')
const defaultConfig = configJson.development_home
// console.log('TCL: defaultConfig', defaultConfig)

const environment = process.env.NODE_ENV || 'development_home'
// console.log('TCL: environment', environment)
const environmentConfig = configJson[environment]

// console.log('TCL: environmentConfig', environmentConfig)
const config = _.merge(defaultConfig, environmentConfig)
// console.log('TCL: finalConfig', config)
// console.log('TCL: finalConfig', finalConfig)

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
// global.gConfig = finalConfig

module.exports = config

// log global.gConfig
// console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`)
