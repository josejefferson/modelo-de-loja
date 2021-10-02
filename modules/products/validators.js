const Joi = require('joi')
const { messages } = require('joi-translation-pt-br')
const schema = {}

// Get
schema.get = Joi.string().lowercase().hex().length(24).required()

// Add
schema.add = Joi.object({
	name: Joi.string().required().label('Nome'),
	description: Joi.string().allow('').label('Descrição'),
	price: Joi.number().min(0).required().label('Preço'),
	oldprice: Joi.number().empty('').min(0).default(null).label('Preço antigo'),
	badge: Joi.string().allow('').label('Selo'),
	image: Joi.string().allow('').label('Imagem'),
	media: Joi.array().items(
		Joi.object({
			type: Joi.string().valid('image', 'yt-video').required(),
			url: Joi.string().required()
		})
	).empty('').label('Mídia'),
	stock: Joi.number().empty('').default(-1).label('Estoque'),
	hidden: Joi.boolean().default(false).label('Oculto'),
}).unknown()

// Edit
schema.edit = Joi.object({
	id: Joi.string().lowercase().hex().length(24).required().label('ID'),
	name: Joi.string().min(5).max(50).label('Nome'),
	email: Joi.string().email().label('E-mail'),
	password: Joi.string().min(8).max(50).label('Senha')
}).unknown()

// Remove
schema.remove = Joi.object({
	id: Joi.string().lowercase().hex().length(24).required().label('ID'),
}).unknown()

function validate(schema, redirect = true, message) {
	return (req, res, next) => {
		const result = schema.validate(req.body, { messages, stripUnknown: true })
		const { value, error } = result
		req.body = value
		if (error) {
			error.redirect = redirect
			error.pageMessage = message
		}
		next(error)
	}
}

function validateParam(schema, param, redirect = true, message) {
	return (req, res, next) => {
		const result = schema.validate(req.params[param], { messages, stripUnknown: true })
		const { value, error } = result
		req.body = value
		if (error) {
			error.redirect = redirect
			error.pageMessage = message
		}
		next(error)
	}
}

module.exports = {
	validate,
	validateParam,
	schema
}