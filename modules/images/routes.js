const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { actions } = require('./database')


routes.get('/', g,
	(req, res, next) => {
		actions.getAll().then((images) => {
			req.data.images = images
			next()
		}).catch(next)
	},
	render(__dirname + '/main', 'Imagens')
)

routes.get('/api', g,
	(req, res, next) => {
		actions.getAll().then((images) => {
			res.json(images)
			next()
		}).catch(next)
	}
)

routes.get('/view/:id', g,
	async (req, res, next) => {
		actions.get({ id: req.params.id }).then((image) => {
			req.data.image = image
			next()
		}).catch(next)
	},
	async (req, res) => {
		res.contentType(req.data.image.contentType)
		res.send(req.data.image.data)
	}
)



routes.post('/upload',
	multer({ dest: './' }).single('files'),
	(req, res, next) => {
		const filePath = path.join(__dirname, '../..', req.file.filename)
		actions.add({
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

routes.get('/remove/:id',
	(req, res, next) => {
		actions.remove({
			id: req.params.id
		}).then(() => {
			req.flash('success_msg', 'Imagem excluída com sucesso')
			res.redirect(req.query.r || '/images')
		}).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir imagem')
			res.redirect(req.query.r || '/images')
		})
	}
)

module.exports = routes