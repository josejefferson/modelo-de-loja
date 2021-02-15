const User = require('../models/User')
const Product = require('../models/Product')

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

module.exports = { findUser, findEmail, comparePasswords, findProduct }