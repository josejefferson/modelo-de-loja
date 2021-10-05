const Joi = require('joi')
const { messages } = require('joi-translation-pt-br')
const schema = {}

// ID
schema.id = Joi.string().lowercase().hex().length(24).required()


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

module.exports = {
	validate,
	schema
}