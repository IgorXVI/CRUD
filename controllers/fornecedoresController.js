const c = require("./controllerFunctions")

const router = c.express.Router()

function formato(req) {
    return cidade = {
        CNPJ: req.body.CNPJ,
        nome: req.body.nome,
        email: req.body.email,
        idCidade: undefined,
        dataAlteracao: c.dataDeHoje(),
        dataCriacao: c.dataDeHoje(),
        telefone: req.body.telefone,
        bairro: req.body.bairro,
        rua: req.body.rua,
        numeroCasa: req.body.numeroCasa,
        complemento: req.body.complemento
    }
}

function validacao(notNULL) {
    return [
        c.validaCNPJ(notNULL),
        c.validaNome(notNULL),
        c.validaEmail(notNULL),
        body("email").custom(email => {
            const DAO = new c.FornecedoresDAO(c.dbConnection)
            return DAO.buscaPorEmail(email).then(objeto => {
                if (objeto) {
                    return Promise.reject('O email informado já está cadastrado.');
                }
            });
        }).optional(),
        c.validaCidade(notNULL),
        c.validaTelefone(notNULL),
        c.validaBairro(notNULL),
        c.validaRua(notNULL),
        c.validaNumeroCasa(notNULL),
        c.validaComplemento(false)
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

    cidadesDAO.buscaPeloNome(req.body.cidade)
        .then(
            (cidade) => {
                objeto.idCidade = cidade.id
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
        cidadesDAO.buscaPeloNome(req.body.cidade)
            .then(
                (cidade) => {
                    objeto.idCidade = cidade.id
                    c.atualizaUm(req, res, objeto, DAO)
                }
            )
    } else {
        c.atualizaUm(req, res, objeto, DAO)
    }
})

module.exports = router