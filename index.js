console.clear()
require('./modules/pretty-error')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const http = require('http')
const server = http.createServer(app)
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const log = require('./Log')('HTTP')

require('./modules/database')
require('./modules/sockets').start(server)

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
	res.locals.successMsg = req.flash('successMsg')
	res.locals.warningMsg = req.flash('warningMsg')
	res.locals.errorMsg = req.flash('errorMsg')
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
server.listen(PORT, () => {
	log('Aberto na porta ' + PORT)
})