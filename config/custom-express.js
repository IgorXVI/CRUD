const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const apiCadastro = require("../controllers/cadastroController")

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use("/api/cadastro", apiCadastro)

module.exports = app