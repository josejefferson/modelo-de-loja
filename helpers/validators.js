const Usuarios = require('../models/Usuarios')
const Produtos = require('../models/Produtos')

async function findUser(value) {
	const user = await Usuarios.findOne({ where: { id: value } }).catch(err => {
		throw 'Ocorreu um erro interno'
	})
	if (!user) return Promise.reject('Este usuário não existe')
}

async function findEmail(value) {
	const email = await Usuarios.findOne({ where: { email: value } }).catch(err => {
		throw 'Ocorreu um erro interno'
	})
	if (email) return Promise.reject('O e-mail já está cadastrado no sistema')
}

function comparePasswords(value, { req }) {
	if (value !== req.body.confirmpassword) throw new Error('As senhas não se correspondem')
	return true
}

async function findProduct(value) {
	const product = await Produtos.findOne({ where: { id: value } }).catch(err => {
		throw 'Ocorreu um erro interno'
	})
	if (!product) return Promise.reject('Este produto não existe')
}

module.exports = {findUser, findEmail, comparePasswords, findProduct}