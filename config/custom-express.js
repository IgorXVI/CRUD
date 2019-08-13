const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require('cors')
var expressRequestId = require('express-request-id');
// const middlewares = require("./middlewares")

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
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
app.use((new(require("../Controllers/CidadesController"))).router)
app.use((new(require("../Controllers/ClientesController"))).router)
app.use((new(require("../Controllers/EstoqueController"))).router)
app.use((new(require("../Controllers/FornecedoresController"))).router)
app.use((new(require("../Controllers/FuncionariosController"))).router)
app.use((new(require("../Controllers/ProdutosController"))).router)
app.use((new(require("../Controllers/VendasController"))).router)

module.exports = app