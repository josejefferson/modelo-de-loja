const express = require('express')
const routes = express.Router()
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const actions = require('./db-actions')

routes.post('/upload',
	multer({ dest: './' }).single('files'),
	(req, res, next) => {
		const filePath = path.join(__dirname, '..', req.file.filename)
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