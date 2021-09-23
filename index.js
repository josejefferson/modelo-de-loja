console.clear()
require('./modules/pretty-error')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const log = require('./Log')('Servidor')

require('./modules/database')

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
app.use(cookieParser())
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.warning_msg = req.flash('warning_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.userData = req.flash('userData')
	res.locals.authUser = req.user || null
	next()
})

app.use(express.static('src'))
app.use('/', require('./modules/routes'))
app.use((req, res, next) => {
	res.status(404).sendFile('src/404.html', { root: '.' })
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	log('Aberto na porta ' + PORT)
})