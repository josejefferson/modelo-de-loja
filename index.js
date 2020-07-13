console.clear()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')
require('./config/auth')(passport)

// Rotas
const pages = require('./routes/pages')
const actions = require('./routes/actions')
const admin_pages = require('./routes/admin-pages')
const admin_actions = require('./routes/admin-actions')

const check = require('./helpers/checks')

// Sessão
app.use(session({
	secret: 'sistema-de-cadastro',
	resave: true,
	saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.data = req.flash('data')
	res.locals.user = req.user || null
	next()
})

// EJS e Express EJS Layouts
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout extractScripts', true)

// Body Parser e Cookie Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// Diretório público
app.use(express.static('public'))

// Rotas
app.use('/', pages)
app.use('/', actions)
app.use('/admin', /*check.admin,*/ admin_pages)
app.use('/admin', /*check.admin,*/ admin_actions)

app.listen(3000, () => {
	console.log('>> [Server] Aberto na porta 3000')
})