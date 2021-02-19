const { validationResult } = require('express-validator')

async function findUser(_id) {
	const user = await User.findOne({ _id }).catch(err => {
		throw 'Ocorreu um erro interno'
	})
	if (!user) return Promise.reject('Este usuário não existe')
}

async function findEmail(email) {
	const user = await User.findOne({ email }).catch(err => {
		throw 'Ocorreu um erro interno'
	})
	if (user) return Promise.reject('O e-mail já está cadastrado no sistema')
}

function comparePasswords(value, { req }) {
	if (value !== req.body.confirmpassword) throw new Error('As senhas não se correspondem')
	return true
}

async function findProduct(_id) {
	const product = await Product.findOne({ _id }).catch(err => {
		throw 'Ocorreu um erro interno'
	})
	if (!product) return Promise.reject('Este produto não existe')
}

function validate(red) {
	return (req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			errors.errors.forEach(err => {
				req.flash('error_msg', err.msg)
				req.flash('data', req.body)
			})
			return res.redirect(red || req.originalUrl)
		}
		return next()
	}
}

module.exports = {
	findUser,
	findEmail,
	comparePasswords,
	findProduct,
	validate
}