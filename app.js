const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded ({extended: true}))
app.use(express.static('public'))


//! get register



//! get home
app.get('/', Controller.home)
app.get('/products', Controller.listProducts)
app.get('/products/add', Controller.getAddProduct)
app.post('/products/add', Controller.postAddProduct)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})