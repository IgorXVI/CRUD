const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const funcionariosController = require("../controllers/funcionariosController")
const cidadesController = require("../controllers/cidadesController")
const globalController = require("../controllers/globalController")
const middlewares = require("./middlewares")

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use("/api", globalController)
app.use("/api/funcionarios", middlewares.checkToken, middlewares.checkNivel(1, "GET"), funcionariosController)
app.use("/api/cidades", middlewares.checkToken, middlewares.checkNivel(2, "GET"), cidadesController)

module.exports = app