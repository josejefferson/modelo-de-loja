console.clear()
// require('./modules/pretty-error')
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
const logger = require('./modules/logger')

require('./modules/database')
require('./modules/login/passport')(passport)
require('./modules/sockets').start(server)

app.set('view engine', 'ejs')
app.use(session({
	secret: 'aVOkg6yTfi',
	resave: true,
	saveUninitialized: false,
	cookie: { expires: 30 * 24 * 60 * 60 * 1000 }
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
app.use(morgan('dev', { stream: { write: (str) => logger().http(str.trim()) } }))
app.use('/', require('./modules/routes'))

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	logger('Express').info('Aberto na porta ' + PORT)
}).on('error', (err) => {
	logger('Express').error(err)
})

process.on('uncaughtException', (err) => {
	logger().crit(err)
})

process.on('beforeExit', (code) => {
	logger().info('Encerrando processo com o código ' + code)
})