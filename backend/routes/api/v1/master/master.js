var db = require('@db/db')
var router = require('express').Router()

const getPropinsi = async (request, response, next) => {
  const propinsi = await db.any('SELECT mst.propinsi_get()')
  console.log(propinsi)
  try {
    response.send(propinsi[0].propinsi_get)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getKota = async (request, response, next) => {
  const propinsiId = request.params.propinsiId
  const kota = await db.any('SELECT mst.kota_get($(propinsiId))', { propinsiId })
  try {
    response.send(kota[0].kota_get)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getKecamatan = async (request, response, next) => {
  const kotaId = request.params.kotaId
  const kecamatan = await db.any(
    'SELECT kecamatan_id, kecamatan_nama FROM mst.kecamatan WHERE kecamatan_kota = $(kotaId) ',
    { kotaId }
  )
  try {
    response.json(kecamatan)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getKelurahan = async (request, response, next) => {
  const kecamatanId = request.params.kecamatanId
  const kelurahan = await db.any(
    'SELECT kelurahan_id, kelurahan_nama FROM mst.kelurahan WHERE kelurahan_kecamatan = $(kecamatanId) ',
    { kecamatanId }
  )
  try {
    response.json(kelurahan)
  } catch (error) {
    return response.status(400).send(error)
  }
}

router.get('/propinsi', getPropinsi)
router.get('/kota/:propinsiId', getKota)
router.get('/kecamatan/:kotaId', getKecamatan)
router.get('/kelurahan/:kecamatanId', getKelurahan)

module.exports = router
