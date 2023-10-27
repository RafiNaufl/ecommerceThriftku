const userController = require('../controllers/userController')
const Controller = require('../controllers/controller')
const router = require('express').Router()
const session = require('express-session')


router.use(session({
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

router.get('/register', islogged, userController.registerForm)

//! post register

router.post('/register', islogged,userController.insertRegister)


//! get login 

router.get('/login', islogged, userController.loginForm)

//! post login
router.post('/login', islogged, userController.insertLogin)




//! session
router.use((req, res, next) => {
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
router.get('/logout', userController.logout)

//! get home
router.get('/', Controller.home)
router.get('/products', Controller.listProducts)
router.get('/products/add', Controller.getAddProduct)
router.post('/products/add', Controller.postAddProduct)
router.get('/products/:id', Controller.listProductsDetail)
router.get('/products/edit/:id', Controller.getEditProduct)
router.post('/products/edit/:id', Controller.postEditProduct)
router.get('/products/delete/:id', Controller.getDeleteProduct)

router.get('/categories/:id/products', Controller.categoryProduct)

router.get('/profile', Controller.Profile)

router.get('/edit/profile', Controller.edit)
router.post('/edit/profile/:id', Controller.insertEdit)

// router.get('/edit/profile/:id', Controller.insertEdit)
router.get('/low', Controller.listProducts)
router.get('/high', Controller.listProducts)


router.get('/buy/:id', Controller.buy)

router.get('/cart', Controller.cart)

router.get('/delete/profile/:id', Controller.deleteUser)




module.exports = router
