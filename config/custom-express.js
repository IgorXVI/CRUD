const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const apiRotas = require("../rotas/rotas")

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use("/api", apiRotas)

module.exports = app