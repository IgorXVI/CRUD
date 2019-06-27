const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")
const middlewares = require("./middlewares")
const path = require('path')

const cidadesRotas = (new (require("../controllers/CidadesController"))).router
const clientesRotas = (new (require("../controllers/ClientesController"))).router
const estoqueRotas = (new (require("../controllers/EstoqueController"))).router
const fornecedoresRotas = (new (require("../controllers/FornecedoresController"))).router
const funcionariosRotas = (new (require("../controllers/FuncionariosController"))).router
const itensVendaRotas = (new (require("../controllers/ItensVendaController"))).router
const produtosRotas = (new (require("../controllers/ProdutosController"))).router
const usuariosRotas = (new (require("../controllers/UsuariosController"))).router
const vendasRotas = (new (require("../controllers/VendasController"))).router

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cookieParser())

//rotas da api
app.use("/api/usuarios", middlewares.checkToken, middlewares.checkNivel(1, ""), usuariosRotas)
app.use("/api/cidades", middlewares.checkToken, middlewares.checkNivel(2, "GET"), cidadesRotas)
app.use("/api/clientes", middlewares.checkToken, middlewares.checkNivel(2, "GET"), clientesRotas)
app.use("/api/estoque", middlewares.checkToken, middlewares.checkNivel(2, "GET"), estoqueRotas)
app.use("/api/fornecedores", middlewares.checkToken, middlewares.checkNivel(2, "GET"), fornecedoresRotas)
app.use("/api/funcionarios", middlewares.checkToken, middlewares.checkNivel(2, "GET"), funcionariosRotas)
app.use("/api/itens-venda",middlewares.checkToken, middlewares.checkNivel(2, "GET"), itensVendaRotas)
app.use("/api/produtos",middlewares.checkToken, middlewares.checkNivel(2, "GET"), produtosRotas)
app.use("/api/vendas", middlewares.checkToken, middlewares.checkNivel(2, "GET"), vendasRotas)

//rotas das paginas
app.use("/", express.static(path.join(__dirname, "../..", "client")))

//rotas de outros arquivos
app.use("/css", express.static(path.join(__dirname, "../..", "node_modules/bootstrap/dist/css")))

module.exports = app