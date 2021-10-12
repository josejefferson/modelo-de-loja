const Joi = require('joi')
const { messages } = require('joi-translation-pt-br')
const schema = {}

// Get
schema.id = Joi.string().lowercase().hex().length(24).required()

// Add
schema.add = Joi.object({
	name: Joi.string().required().label('Nome'),
	description: Joi.string().allow('').label('Descrição'),
	price: Joi.number().min(0).required().label('Preço'),
	oldprice: Joi.number().empty('').min(0).default(null).label('Preço antigo'),
	badge: Joi.string().allow('').label('Selo'),
	image: Joi.object({
		type: Joi.string().valid('image.url', 'image.id').required(),
		value: Joi.string().required()
	}).label('Imagem'),
	media: Joi.array().items(
		Joi.object({
			type: Joi.string().valid('image.url', 'image.id', 'youtube').required(),
			value: Joi.string().required()
		})
	).empty('').label('Mídia'),
	stock: Joi.number().empty('').default(-1).label('Estoque'),
	hidden: Joi.boolean().default(false).label('Oculto'),
}).unknown()

// Edit
schema.edit = Joi.object({
	name: Joi.string().required().label('Nome'),
	description: Joi.string().allow('').label('Descrição'),
	price: Joi.number().min(0).required().label('Preço'),
	oldprice: Joi.number().empty('').min(0).default(null).label('Preço antigo'),
	badge: Joi.string().allow('').label('Selo'),
	image: Joi.object({
		type: Joi.string().valid('image.url', 'image.id').required(),
		value: Joi.string().required()
	}).label('Imagem'),
	media: Joi.array().items(
		Joi.object({
			type: Joi.string().valid('image.url', 'image.id', 'youtube').required(),
			value: Joi.string().required()
		})
	).empty('').label('Mídia'),
	stock: Joi.number().empty('').default(-1).label('Estoque'),
	hidden: Joi.boolean().default(false).label('Oculto'),
}).unknown()

// Remove
schema.remove = Joi.object({
	id: Joi.string().lowercase().hex().length(24).required().label('ID'),
}).unknown()



function validator(schema, data, options = {}) {
	return schema.validate(data, { messages, stripUnknown: true, ...options })
}

const validate = {}
validate.id = (req, res, next) => {
	if (validator(schema.id, req.params.id).error) {
		return res.status(400).render('others/error', {
			_title: 'ID inválido',
			message: 'Verifique se o link está correto'
		})
	}
	next()
}

validate.add = (req, res, next) => {
	const { error, value } = validator(schema.add, req.body)
	if (error) {
		req.flash('errorMsg', 'Dados inválidos\n' + error.message)
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/products/add')
		return
	}
	req.body = value
	next()
}

validate.edit = (req, res, next) => {
	const { error, value } = validator(schema.edit, req.body)
	if (error) {
		req.flash('errorMsg', 'Dados inválidos\n' + error.message)
		req.flash('userData', req.body)
		res.redirect(req.query.r || `/products/edit/${req.params.id}`)
		return
	}
	req.body = value
	next()
}

module.exports = {
	validate,
	schema
}