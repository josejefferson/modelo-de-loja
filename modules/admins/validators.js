const Joi = require('joi')
const { messages } = require('joi-translation-pt-br')
const schema = {}
// Add
schema.add = Joi.object({
	name: Joi.string().min(5).max(50).required().label('Nome'),
	email: Joi.string().email().required().label('E-mail'),
	password: Joi.string().min(8).max(50).required().label('Senha'),
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

function validate(schema) {
	return (req, res, next) => {
		const result = schema.validate(req.body, { messages, stripUnknown: true })
		const { value, error } = result
		req.body = value
		console.log(value)
		next(error)
	}
}

module.exports = {
	validate,
	schema
}