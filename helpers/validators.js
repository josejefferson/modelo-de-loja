const { body } = require('express-validator')
const {
	findUser,
	findEmail,
	comparePasswords,
	findProduct,
	validate } = require('./customValidators')

module.exports = {
	buy: [],
	cart: [],
	usersAdd: [],
	usersEdit: [],
	login: [
		body('email').notEmpty().bail().isEmail(),
		body('password').notEmpty(),
		validate() // repetir
	],
	adminsAdd: [
		body('name').notEmpty().trim(),
		body('email').notEmpty().trim().bail().isEmail().bail().custom(findEmail),
		body('password').notEmpty().bail().custom(comparePasswords)
	],
	adminsEdit: [
		body('id').notEmpty().bail().custom(findUser),
		body('email').optional({ checkFalsy: true }).isEmail().bail().custom(findEmail),
		body('password').optional({ checkFalsy: true }).custom(comparePasswords)
	],
	adminsRemove: [
		body('id').notEmpty().bail().custom(findUser)
	],
	productsAdd: [
		body('name').notEmpty().trim(),
		body('description').optional({ checkFalsy: true }).trim(),
		body('price').notEmpty().bail().isDecimal(),
		body('image').optional({ checkFalsy: true }).isURL(),
		body('stock').notEmpty().bail().isInt(),
	],
	productsEdit: [
		body('id').bail().custom(findProduct),
		body('name').optional({ checkFalsy: true }),
		body('description').optional().if(body('description').notEmpty()),
		body('price').optional({ checkFalsy: true }).isDecimal(),
		body('image').optional().if(body('image').notEmpty()).isURL(),
		body('stock').optional({ checkFalsy: true }).isInt(),
	],
	productsRemove: [
		body('id').notEmpty().bail().custom(findProduct)
	],
	requestsConfirm: []
}