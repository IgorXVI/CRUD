const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")

const app = express()
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(expressValidator())

const routes = require("./routes/routes")
routes(app)

const porta = 6663
app.listen(porta, ()=>{
    console.log(`ouvindo na porta ${porta}`)
})