console.clear()
require('./modules/pretty-error')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const http = require('http')
const server = http.createServer(app)
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const { render } = require('./helpers/helpers')
const log = require('./modules/log')('Express')

require('./modules/database')
require('./modules/login/passport')(passport)
require('./modules/sockets').start(server)

app.set('view engine', 'ejs')
app.use(session({
	secret: 'aVOkg6yTfi',
	resave: true,
	saveUninitialized: false,
	cookie: { expires: 30 * 24 * 60 * 60 * 1000 },
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
	res.locals.authUser = req.user || null
	next()
})
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressLayouts)
app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.static('src'))
app.use(morgan('dev'))
app.use('/', require('./modules/routes'))

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	log('Aberto na porta ' + PORT)
})

process.on('uncaughtException', (err) => {
	console.error(err)
})