const Joi = require('joi')
const { messages } = require('joi-translation-pt-br')
const schema = {}

// ID
schema.id = Joi.string().lowercase().hex().length(24).required()
/*
// Add
schema.add = Joi.object({
	name: Joi.string().min(5).max(50).required().label('Nome'),
	email: Joi.string().email().required().label('E-mail'),
	password: Joi.string().min(8).max(50).required().label('Senha'),
}).unknown()

// Edit
schema.edit = Joi.object({
	name: Joi.string().min(5).max(50).label('Nome'),
	email: Joi.string().email().label('E-mail'),
	password: Joi.string().min(8).max(50).label('Senha')
}).unknown()

// Remove
schema.remove = Joi.object({
	id: Joi.string().lowercase().hex().length(24).required().label('ID'),
}).unknown()
*/

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
/*
validate.add = (req, res, next) => {
	const { error, value } = validator(schema.add, req.body)
	if (error) {
		req.flash('errorMsg', 'Dados inválidos\n' + error.message)
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/admins/add')
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
		res.redirect(req.query.r || `/admins/edit/${req.params.id}`)
		return
	}
	req.body = value
	next()
}
*/
module.exports = {
	validate,
	schema
}