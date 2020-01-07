var db = require('@db/db')
var router = require('express').Router()

const getPropinsi = async (request, response, next) => {
  const propinsi = await db.any('SELECT mst.propinsi_get()')
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

const getKategoriWisata = async (request, response, next) => {
  const kategoriWisata = await db.any(
    'SELECT * FROM mst.kategori_wisata_get()'
  )
  try {
    response.json(kategoriWisata[0].kategori_wisata)
  } catch (error) {
    return response.status(400).send(error)
  }
}

// Wisata ---------------------------------------------------------------------------------------------------------

const getWisata = async (request, response, next) => {
  const jenis = request.params.jenis
  const search = request.params.search

  const query = `SELECT wisata_id, wisata_nama, wisata_propinsi, wisata_kota, 
                wisata_deskripsi, wisata_kategori,wisata_longitude, wisata_latitude, wisata_images 
                FROM mst.wisata `
  let where
  let values

  if (jenis === 'propinsi') {
    where = 'WHERE wisata_propinsi = $(search)'
    values = { search }
  }

  if (jenis === 'kota') {
    where = 'WHERE wisata_kota = $(search)'
    values = { search }
  }

  if (jenis === 'kategori') {
    where = 'WHERE wisata_kategori = $(search)'
    values = { search }
  }

  const wisata = await db.any(query || where, values)
  try {
    response.json(wisata)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const postWisata = async (request, response, next) => {
  const { nama, propinsi, kota, deskripsi, kategori, logitude, latitude, images } = request.body
  const imagesJ = JSON.stringify(images)
  const posting = await db.one(`INSERT INTO mst.wisata (wisata_nama, wisata_propinsi, wisata_kota, wisata_deskripsi, wisata_kategori, wisata_logitute, wisata_latitude, wisata_images )
        VALUES ($(nama),$(propinsi),$(kota),$(deskripsi),$(kategori),$(logitude),$(latitude),$(imagesJ)) RETURNING wisata_id 
        `, { nama, propinsi, kota, deskripsi, kategori, logitude, latitude, imagesJ })
  try {
    response.json(posting)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const putWisata = async (request, response, next) => {
  const id = request.params.id
  const { nama, propinsi, kota, deskripsi, kategori, logitude, latitude, images } = request.body
  const imagesJ = JSON.stringify(images)
  await db.none(`UDPATE mst.wisata SET wisata_nama = $(nama), wisata_propinsi = ,$(propinsi), wisata_kota = $(kota), 
          wisata_deskripsi = $(deskripsi) , wisata_kategori = $(kategori), wisata_logitute = $(logitude), wisata_latitude = $(latitude), wisata_images = $(imagesJ)
          WHERE wisata_id = $(id)
        `, { nama, propinsi, kota, deskripsi, kategori, logitude, latitude, imagesJ, id })
  try {
    response.json('updated')
  } catch (error) {
    return response.status(400).send(error)
  }
}

const deleteWisata = async (request, response, next) => {
  const id = request.params.id
  try {
    const result = await db.result('DELETE FROM mst.wisata WHERE wisata_id = $(id)', { id })
    response.json(result.rowCount)
  } catch (error) {
    return response.status(400).send(error)
  }
}

// Pictures ---------------------------------------------------------------------------------------------------------

const getPictures = async (request, response, next) => {
  const jenis = request.params.jenis
  const search = request.params.search

  let query
  let values
  if (jenis === 'propinsi' && search === 'all') {
    query = 'SELECT propinsi_pictures_id, propinsi_pictures_data FROM mst.propinsi_pictures ORDER BY propinsi_pictures_id'
  }
  if (jenis === 'propinsi' && search !== 'all') {
    query = 'SELECT propinsi_pictures_id, propinsi_pictures_data FROM mst.propinsi_pictures WHERE propinsi_pictures_id = $(search) '
    values = { search }
  }
  if (jenis === 'kota' && search === 'all') {
    query = 'SELECT kota_pictures_id, kota_pictures_data FROM mst.kota_pictures ORDER BY kota_pictures_id'
  }
  if (jenis === 'kota' && search !== 'all') {
    query = 'SELECT kota_pictures_id, kota_pictures_data FROM mst.kota_pictures WHERE kota_pictures_id = $(search) '
    values = { search }
  }
  if (jenis === 'kategori' && search === 'all') {
    query = 'SELECT kategori_wisata_pictures_id, kategori_wisata_pictures_data FROM mst.kategori_wisata_pictures ORDER BY kota_pictures_id'
  }
  if (jenis === 'kategori' && search !== 'all') {
    query = 'SELECT kategori_wisata_pictures_id, kategori_wisata_pictures_data FROM mst.kategori_wisata_pictures WHERE kategori_wisata_pictures_id = $(search) '
    values = { search }
  }

  const pictures = await db.any(query, values)
  try {
    response.send(pictures)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const deletePictures = async (request, response, next) => {
  const jenis = request.params.jenis
  const search = request.params.search

  let query
  let values

  if (jenis === 'propinsi' && search !== 'all') {
    query = 'DELETE FROM mst.propinsi_pictures WHERE propinsi_pictures_id = $(search) '
    values = { search }
  }
  if (jenis === 'kota' && search !== 'all') {
    query = 'DELETE FROM mst.kota_pictures WHERE kota_pictures_id = $(search) '
    values = { search }
  }
  if (jenis === 'kategori' && search !== 'all') {
    query = 'DELETE FROM mst.kategori_wisata_pictures WHERE kategori_wisata_pictures_id = $(search) '
    values = { search }
  }

  const pictures = await db.any(query, values)
  try {
    response.send(pictures)
  } catch (error) {
    return response.status(400).send(error)
  }
}

router.get('/propinsi', getPropinsi)
router.get('/kota/:propinsiId', getKota)
router.get('/kecamatan/:kotaId', getKecamatan)
router.get('/kelurahan/:kecamatanId', getKelurahan)
router.get('/kategoriwisata', getKategoriWisata)
router.get('/wisata/:jenis/:search', getWisata)
router.post('/wisata', postWisata)
router.put('/wisata/:id', putWisata)
router.delete('/wisata/:id', deleteWisata)
router.get('/pictures/:jenis/:search', getPictures)
router.delete('/pictures/:jenis/:search', deletePictures)

module.exports = router
