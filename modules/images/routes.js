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
	multer({
		dest: './temp/', limits: { fileSize: 5242880 }, fileFilter: (req, file, cb) => {
			const accept = ([
				'image/jpg',
				'image/jpeg',
				'image/png',
				'image/webp',
				'image/svg+xml']).includes(file.mimetype)
			cb(accept ? null : new Error('O tipo do arquivo é incompatível'), accept)
		}
	}).single('files'),
	(req, res, next) => {
		const filePath = path.join(__dirname, '../../temp/', req.file.filename)
		db.add({
			file: fs.readFileSync(filePath),
			contentType: req.file.mimetype
		}).then(() => {
			res.json({ success: true })
		}).catch((err) => {
			console.error(err)
			res.json({ success: false })
		}).finally(() => {
			fs.unlink(filePath, () => { })
		})
	},
	(err, req, res, next) => {
		if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE')
			err.message = 'O tamanho do arquivo excede 5 MB'
		res.status(400).json({
			success: false,
			error: { message: err.message, code: err.code, ...err }
		})
	}
)

routes.get('/remove/:id', db.remove)