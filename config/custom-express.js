const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")
const cors = require('cors')
var expressRequestId = require('express-request-id');
// const middlewares = require("./middlewares")

const cidadesRotas = (new (require("../Controllers/CidadesController"))).router
const clientesRotas = (new (require("../Controllers/ClientesController"))).router
const estoqueRotas = (new (require("../Controllers/EstoqueController"))).router
const fornecedoresRotas = (new (require("../Controllers/FornecedoresController"))).router
const funcionariosRotas = (new (require("../Controllers/FuncionariosController"))).router
const produtosRotas = (new (require("../Controllers/ProdutosController"))).router
const usuariosRotas = (new (require("../Controllers/UsuariosController"))).router
const vendasRotas = (new (require("../Controllers/VendasController"))).router

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cookieParser())
app.use(cors())
app.use(expressRequestId())

//rotas da api
// app.use("/api/usuarios", middlewares.checkToken, middlewares.checkNivel(1, "GET"), usuariosRotas)
// app.use("/api/cidades", middlewares.checkToken, middlewares.checkNivel(2, "GET"), cidadesRotas)
// app.use("/api/clientes", middlewares.checkToken, middlewares.checkNivel(2, "GET"), clientesRotas)
// app.use("/api/estoque", middlewares.checkToken, middlewares.checkNivel(2, "GET"), estoqueRotas)
// app.use("/api/fornecedores", middlewares.checkToken, middlewares.checkNivel(2, "GET"), fornecedoresRotas)
// app.use("/api/funcionarios", middlewares.checkToken, middlewares.checkNivel(2, "GET"), funcionariosRotas)
// app.use("/api/produtos",middlewares.checkToken, middlewares.checkNivel(2, "GET"), produtosRotas)
// app.use("/api/vendas", middlewares.checkToken, middlewares.checkNivel(2, "GET"), vendasRotas)
app.use("/api/cidades", cidadesRotas)
app.use("/api/clientes", clientesRotas)
app.use("/api/estoque", estoqueRotas)
app.use("/api/fornecedores", fornecedoresRotas)
app.use("/api/funcionarios", funcionariosRotas)
app.use("/api/produtos", produtosRotas)
app.use("/api/vendas", vendasRotas)

module.exports = app