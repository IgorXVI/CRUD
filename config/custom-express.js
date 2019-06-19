const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const funcionariosController = require("../controllers/funcionariosController")
const cidadesController = require("../controllers/cidadesController")
const globalController = require("../controllers/globalController")
const JWTautenticacao = require("./JWTautenticacao")

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use("/api", globalController)
app.use("/api/funcionarios", JWTautenticacao.checkToken, funcionariosController)
app.use("/api/cidades", JWTautenticacao.checkToken, cidadesController)

module.exports = app