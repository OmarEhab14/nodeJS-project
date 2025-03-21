const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
require('dotenv/config')

app.set('view engine', 'ejs')

mongoose.connect(process.env.connect_DB).then(() => console.log('connected...')).catch((e) => console.log(e));
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // body parser user_name=Omar&password=slkjdfiofjd 

app.use(session({
    secret: "secret_key", // random string used to encrypt session data
    resave: false, // when set to false, the session is only saved when modified | true -> saved on every request
    saveUninitialized: true, // true -> creates session for every visitor | false -> creates session only when data is added to it
    cookie: {
        secure: false, // true -> cookie only sent via HTTPS | fasle -> cookie is sent over both HTTP and HTTPS (useful for development)
        maxAge: 24 * 60 * 60 * 1000, // session expiry
    }
}))

app.use('/api/users', require('./routes/usersApi/getRoutes'))
app.use('/api/users', require('./routes/usersApi/postRoutes'))
app.use('/api/users', require('./routes/usersApi/putRoutes'))
app.use('/api/users', require('./routes/usersApi/deleteRoutes'))

app.use('/api/products', require('./routes/productsApi/getRoutes'))
app.use('/api/products', require('./routes/productsApi/postRoutes'))
app.use('/api/products', require('./routes/productsApi/putRoutes'))
app.use('/api/products', require('./routes/productsApi/deleteRoutes'))

app.use('/', require('./routes/view/authRoutes'))
app.use('/', require('./routes/view/viewRoutes'))

app.listen(4000);