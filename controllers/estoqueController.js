const c = require("./controllerFunctions")

const router = c.express.Router()

function formato(req) {
    return cidade = {
        quantidade: req.body.quantidade,
        idProduto: undefined,
        dataAlteracao: c.dataDeHoje(),
        dataCriacao: c.dataDeHoje()
    }
}

function validacao(notNULL) {
    return [
        c.validaQuantidade(notNULL),
        c.validaProduto(notNULL)
    ]
}

router.get("/", (req, res) => {
    console.log("buscando todas os fornecedores...")
    const DAO = new c.FornecedoresDAO(c.dbConnection)
    c.buscaTodos(req, res, DAO)
})

router.post("/fornecedor", validacao(true), (req, res) => {
    console.log("cadastrando fornecedor...")
    c.checkErros(req, res)
    let objeto = formato(req)
    const DAO = new c.FornecedoresDAO(c.dbConnection)
    const cidadesDAO = new c.FornecedoresDAO(c.dbConnection)

    cidadesDAO.buscaIdPeloNome(req.body.cidade)
        .then(
            (id) => {
                objeto.idCidade = id.id
                c.adicionaUm(req, res, objeto, DAO)
            }
        )

})

router.get("/fornecedor/:id", (req, res) => {
    console.log(`buscando fornecedor com id: ${req.params.id}...`)
    const DAO = new c.FornecedoresDAO(c.dbConnection)
    c.buscaUm(req, res, DAO)
})

router.delete("/fornecedor/:id", (req, res) => {
    console.log(`deletando fornecedor com id: ${req.params.id}...`)
    const DAO = new c.FornecedoresDAO(c.dbConnection)
    c.deletaUm(req, res, DAO)
})

router.post("/fornecedor/:id", validacao(false), (req, res) => {
    console.log(`atualizando fornecedor com id: ${req.params.id}...`)
    c.checkErros(req, res)
    let objeto = formato(req)
    const DAO = new c.FornecedoresDAO(c.dbConnection)
    const cidadesDAO = new c.CidadesDAO(c.dbConnection)

    if (req.body.cidade) {
        cidadesDAO.buscaIdPeloNome(req.body.cidade)
            .then(
                (id) => {
                    objeto.idCidade = id
                    c.atualizaUm(req, res, objeto, DAO)
                }
            )
    } else {
        c.atualizaUm(req, res, objeto, DAO)
    }
})

module.exports = router