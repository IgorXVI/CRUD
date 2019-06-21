const c = require("./controllerFunctions")

const router = c.express.Router()

function formato(req) {
    return {
        CPF: req.body.CPF,
        nome: req.body.nome,
        email: req.body.email,
        idCidade: undefined,
        dataAlteracao: c.dataDeHoje(),
        dataCriacao: c.dataDeHoje(),
        bairro: req.body.bairro,
        rua: req.body.rua,
        numeroCasa: req.body.numeroCasa,
        telefone: req.body.telefone,
        dataNasc: req.body.dataNasc,
        complemento: req.body.complemento
    }
}

function validacao(notNULL) {
    return [
        c.validaCPF(notNULL),
        c.validaNome(notNULL),
        c.validaEmail(notNULL),
        body("email").custom(email => {
            const DAO = new c.ClientesDAO(c.dbConnection)
            return DAO.buscaPorEmail(email).then(objeto => {
                if (objeto) {
                    return Promise.reject('O email informado já está cadastrado.');
                }
            });
        }).optional(),
        c.validaCidade(notNULL),
        c.validaBairro(notNULL),
        c.validaRua(notNULL),
        c.validaNumeroCasa(notNULL),
        c.validaTelefone(notNULL),
        c.validaDataNasc(notNULL),
        c.validaComplemento(false)
    ]
}

router.get("/", (req, res) => {
    console.log("buscando todas os clientes...")
    const DAO = new c.ClientesDAO(c.dbConnection)
    c.buscaTodos(req, res, DAO)
})

router.post("/cliente", validacao(true), (req, res) => {
    console.log("cadastrando cliente...")
    c.checkErros(req, res)
    let objeto = formato(req)
    const DAO = new c.ClientesDAO(c.dbConnection)
    const cidadesDAO = new c.CidadesDAO(c.dbConnection)

    cidadesDAO.buscaIdPeloNome(req.body.cidade)
        .then(
            (id) => {
                objeto.idCidade = id.id
                c.adicionaUm(req, res, objeto, DAO)
            }
        )

})

router.get("/cliente/:id", (req, res) => {
    console.log(`buscando cliente com id: ${req.params.id}...`)
    const DAO = new c.ClientesDAO(c.dbConnection)
    c.buscaUm(req, res, DAO)
})

router.delete("/cliente/:id", (req, res) => {
    console.log(`deletando cliente com id: ${req.params.id}...`)
    const DAO = new c.ClientesDAO(c.dbConnection)
    c.deletaUm(req, res, DAO)
})

router.post("/cliente/:id", validacao(false), (req, res) => {
    console.log(`atualizando cliente com id: ${req.params.id}...`)
    c.checkErros(req, res)
    let objeto = formato(req)
    const DAO = new c.ClientesDAO(c.dbConnection)
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