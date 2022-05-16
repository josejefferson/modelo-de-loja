const Image = require('mongoose').model('Images')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
module.exports = db = {}

db.get = (req, res, next) => {
	Image.findById(req.params.id).then((image) => {
		if (!image) return res.status(400).render('others/error', {
			_title: 'Esta imagem não existe',
			message: 'Talvez o link esteja incorreto ou a imagem foi excluída'
		})
		req.data.image = image
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar a imagem',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.render = (req, res, next) => {
	res.contentType(req.data.image.contentType)
	res.send(req.data.image.data)
}

db.getAll = (req, res, next) => {
	Image.find().select('-data').then((images) => {
		req.data.images = images.reverse() || []
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar imagens',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.jsonAll = (req, res, next) => {
	res.json(req.data.images)
}

db.upload = [
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
		Image.create({
			data: fs.readFileSync(filePath),
			contentType: req.file.mimetype
		}).then((image) => {
			res.json({ success: true, id: image._id })
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
]

db.remove = (req, res, next) => {
	Image.findByIdAndDelete(req.params.id).then((image) => {
		req.flash('successMsg', 'Imagem excluída com sucesso')
		res.redirect(req.query.r || '/images')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao excluir imagem')
		res.redirect(req.query.r || '/images')
	})
}