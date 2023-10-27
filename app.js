const express = require('express')
const router = require('./router')
const app = express()
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded ({extended: true}))
app.use(express.static('public'))
app.use(router)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})