const Image = require('mongoose').model('Images')
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

db.add = ({ file, contentType } = {}) => {
	return Image.create({
		data: file,
		contentType: contentType
	})
}

db.remove = (req, res, next) => {
	Image.deleteMany({ _id: req.params.id }).then(() => {
		req.flash('successMsg', 'Imagem excluída com sucesso')
		res.redirect(req.query.r || '/images')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao excluir imagem')
		res.redirect(req.query.r || '/images')
	})
}