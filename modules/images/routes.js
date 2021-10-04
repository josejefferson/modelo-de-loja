const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const db = require('./database')
module.exports = routes


routes.get('/', db.getAll, render('images', 'Imagens'))

routes.get('/api', db.getAll,
	(req, res, next) => { res.json(req.data.images) }
)

routes.get('/view/:id',
	db.get,
	(req, res, next) => {
		res.contentType(req.data.image.contentType)
		res.send(req.data.image.data)
	}
)

routes.post('/upload',
	multer({ dest: './' }).single('files'),
	(req, res, next) => {
		const filePath = path.join(__dirname, '../..', req.file.filename)
		db.add({
			file: fs.readFileSync(filePath),
			contentType: req.file.mimetype
		}).then(() => {
			res.json({ success: true })
		}).catch(err => {
			res.json({ success: false })
		}).finally(() => {
			fs.unlink(filePath, () => { })
		})
	}
)

routes.get('/remove/:id', db.remove)