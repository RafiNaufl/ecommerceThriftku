const express = require('express')
const Controller = require('./controllers/controller')
const userController = require('./controllers/userController')
const app = express()
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded ({extended: true}))
app.use(express.static('public'))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
        }
}))


let islogged = function(req, res, next) {
    // console.log(req.session);
    if(req.session.userId) {
        res.redirect('/')
    }else {
        next()        
    }
}

//! get register

app.get('/register', islogged, userController.registerForm)

//! post register

app.post('/register', islogged,userController.insertRegister)


//! get login 

app.get('/login', islogged, userController.loginForm)

//! post login
app.post('/login', islogged, userController.insertLogin)




//! session
app.use((req, res, next) => {
    // console.log(req.session);
    if(!req.session.userId) {
        const err = 'please login first'
        res.redirect(`/login?err=${err}`)
    }else {
        next()        
    }
    // console.log('Time:', Date.now())
})


//! get logOut
app.get('/logout', userController.logout)

//! get home
app.get('/', Controller.home)
app.get('/products', Controller.listProducts)
app.get('/products/add', Controller.getAddProduct)
app.post('/products/add', Controller.postAddProduct)
app.get('/products/:id', Controller.listProductsDetail)

app.get('/a', (req, res) => {
    res.send('kok bisa masuk')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})