console.clear()
const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const flash = require('connect-flash')
const session = require('express-session')
const morgan = require('morgan')

const LOCAL_DB = 'mongodb://localhost'

mongoose.connect(LOCAL_DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		console.log('>> [MongoDB] Conectado')
	})
	.catch(console.error)

app.set('view engine', 'ejs')
app.set('layout extractScripts', true)
app.use(session({
	secret: 'aVOkg6yTfi',
	resave: true,
	saveUninitialized: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressLayouts)
app.use(flash())
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.warning_msg = req.flash('warning_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.userData = req.flash('userData')
	res.locals.authUser = req.user || null
	next()
})
app.use(express.static('src'))
// app.use(morgan('dev'))
app.use('/', require('./modules/routes'))

app.listen(3000, () => console.log('>>> Start!'))