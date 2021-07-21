const express = require('express')
const routes = express.Router()
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const actions = require('./db-actions')

routes.post('/images/upload', multer({ dest: './' }).single('files'), () => {
	// TODO: colocar isso para função de validação
	let valid = true
	if (!req.file) return res.json({ success: false, err: 'Nenhum arquivo enviado' })
	const filePath = path.join(__dirname, '..', req.file.filename)

	if (!['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
		.includes(req.file.mimetype) || req.file.size > 5242880) {
		valid = false
		res.json({ invalid: true })
	}

	const params = {
		file: fs.readFileSync(filePath),
		contentType: req.file.mimetype
	}

	if (valid) actions.add(params).then(() => {
		res.json({ success: true })
	}).catch(err => {
		res.json({ success: false })
	}).finally(() => {
		fs.unlink(filePath, () => { })
	})
})

routes.get('/images/remove/:id', (req, res, next) => {
	const params = {
		id: req.params.id
	}

	actions.remove(params).then(() => {
		req.flash('success_msg', 'Imagem excluída com sucesso')
		res.redirect(req.query.r || '/images')
	}).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir imagem')
		res.redirect(req.query.r || '/images')
	})
})

module.exports = routes