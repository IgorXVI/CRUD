const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const middlewares = require("./middlewares")

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
app.use("/api/usuarios", middlewares.checkToken, usuariosRotas)
app.use("/api/cidades", middlewares.checkToken, cidadesRotas)
app.use("/api/clientes", middlewares.checkToken, clientesRotas)
app.use("/api/estoque", middlewares.checkToken, estoqueRotas)
app.use("/api/fornecedores", middlewares.checkToken, fornecedoresRotas)
app.use("/api/funcionarios", middlewares.checkToken, funcionariosRotas)
app.use("/api/itens-venda",middlewares.checkToken, itensVendaRotas)
app.use("/api/produtos",middlewares.checkToken, produtosRotas)
app.use("/api/vendas", middlewares.checkToken, vendasRotas)

module.exports = app