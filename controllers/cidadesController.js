const c = require("./controllerFunctions")

const router = c.express.Router()

function formato(req) {
    return cidade = {
        nome: req.body.nome,
        UF: req.body.UF,
        CEP: req.body.CEP,
        dataAlteracao: c.dataDeHoje(),
        dataCriacao: c.dataDeHoje()
    }
}

function validacao(notNULL) {
    return [
        c.validaNome(notNULL),
        c.validaUF(notNULL),
        c.validaCEP(notNULL)
    ]
}

router.get("/", (req, res) => {
    console.log("buscando todas as cidades...")
    const DAO = new c.CidadesDAO(c.dbConnection)
    c.buscaTodos(req, res, DAO)
})

router.post("/cidade", validacao(true), (req, res) => {
    console.log("cadastrando cidade...")
    c.checkErros(req, res)
    let objeto = formato(req)
    const DAO = new c.CidadesDAO(c.dbConnection)
    c.adicionaUm(req, res, objeto, DAO)
})

router.get("/cidade/:id", (req, res) => {
    console.log(`buscando cidade com id: ${req.params.id}...`)
    const DAO = new c.CidadesDAO(c.dbConnection)
    c.buscaUm(req, res, DAO)
})

router.delete("/cidade/:id", (req, res) => {
    console.log(`deletando a cidade com id: ${req.params.id}...`)
    const DAO = new c.CidadesDAO(c.dbConnection)
    c.deletaUm(req, res, DAO)
})

router.post("/ciadade/:id", validacao(false), (req, res) => {
    console.log(`atualizando cidade com id: ${req.params.id}...`)
    c.checkErros()
    let objeto = formato(req)
    const DAO = new c.CidadesDAO(c.dbConnection)
    c.atualizaUm(req, res, objeto, DAO)
})

module.exports = router