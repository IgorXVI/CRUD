const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")
const middlewares = require("./middlewares")
const path = require('path')

const cidadesRotas = (new (require("../Controllers/CidadesController"))).router
const clientesRotas = (new (require("../Controllers/ClientesController"))).router
const estoqueRotas = (new (require("../Controllers/EstoqueController"))).router
const fornecedoresRotas = (new (require("../Controllers/FornecedoresController"))).router
const funcionariosRotas = (new (require("../Controllers/FuncionariosController"))).router
const itensVendaRotas = (new (require("../Controllers/ItensVendaController"))).router
const produtosRotas = (new (require("../Controllers/ProdutosController"))).router
const usuariosRotas = (new (require("../Controllers/UsuariosController"))).router
const vendasRotas = (new (require("../Controllers/VendasController"))).router

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cookieParser())

//rotas da api
// app.use("/api/usuarios", middlewares.checkToken, middlewares.checkNivel(1, "GET"), usuariosRotas)
// app.use("/api/cidades", middlewares.checkToken, middlewares.checkNivel(2, "GET"), cidadesRotas)
// app.use("/api/clientes", middlewares.checkToken, middlewares.checkNivel(2, "GET"), clientesRotas)
// app.use("/api/estoque", middlewares.checkToken, middlewares.checkNivel(2, "GET"), estoqueRotas)
// app.use("/api/fornecedores", middlewares.checkToken, middlewares.checkNivel(2, "GET"), fornecedoresRotas)
// app.use("/api/funcionarios", middlewares.checkToken, middlewares.checkNivel(2, "GET"), funcionariosRotas)
// app.use("/api/itens-venda",middlewares.checkToken, middlewares.checkNivel(2, "GET"), itensVendaRotas)
// app.use("/api/produtos",middlewares.checkToken, middlewares.checkNivel(2, "GET"), produtosRotas)
// app.use("/api/vendas", middlewares.checkToken, middlewares.checkNivel(2, "GET"), vendasRotas)
app.use("/api/usuarios", usuariosRotas)
app.use("/api/cidades", cidadesRotas)
app.use("/api/clientes", clientesRotas)
app.use("/api/estoque", estoqueRotas)
app.use("/api/fornecedores", fornecedoresRotas)
app.use("/api/funcionarios", funcionariosRotas)
app.use("/api/itens-venda", itensVendaRotas)
app.use("/api/produtos", produtosRotas)
app.use("/api/vendas", vendasRotas)

//rotas das paginas
app.use("/", express.static(path.join(__dirname, "../..", "client")))
app.use("/signup", express.static(path.join(__dirname, "../..", "client/paginas/signup.html")))
app.use("/usuarios", middlewares.checkToken, middlewares.checkNivel(1, "GET"), express.static(path.join(__dirname, "../..", "client/paginas/usuarios.html")))
app.use("/produtos", middlewares.checkToken, express.static(path.join(__dirname, "../..", "client/paginas/produtos.html")))
app.use("/cidades", middlewares.checkToken, express.static(path.join(__dirname, "../..", "client/paginas/cidades.html")))
app.use("/fornecedores", middlewares.checkToken, express.static(path.join(__dirname, "../..", "client/paginas/fornecedores.html")))
app.use("/estoque", middlewares.checkToken, express.static(path.join(__dirname, "../..", "client/paginas/estoque.html")))
app.use("/vendas", middlewares.checkToken, express.static(path.join(__dirname, "../..", "client/paginas/vendas.html")))
app.use("/itens-venda", middlewares.checkToken, express.static(path.join(__dirname, "../..", "client/paginas/itens-venda.html")))
app.use("/funcionarios", middlewares.checkToken, express.static(path.join(__dirname, "../..", "client/paginas/funcionarios.html")))
app.use("/clientes", middlewares.checkToken, express.static(path.join(__dirname, "../..", "client/paginas/clientes.html")))


//rotas de outros arquivos
app.use("/bootstrap", express.static(path.join(__dirname, "../..", "node_modules/bootstrap/dist")))
app.use("/jquery", express.static(path.join(__dirname, "../..", "node_modules/jquery/dist")))
app.use("/html2canvas", express.static(path.join(__dirname, "../..", "node_modules/html2canvas/dist")))

module.exports = app