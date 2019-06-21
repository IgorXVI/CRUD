const bcrypt = require("bcrypt")
const c = require("./controllerFunctions")

const {
    body
} = require("express-validator/check")

const router = c.express.Router()

function formato(req) {
    return {
        CPF: req.body.CPF,
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        salario: req.body.salario,
        idCidade: undefined,
        nivelAcesso: req.body.nivelAcesso,
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
            const DAO = new c.FuncionariosDAO(c.dbConnection)
            return DAO.buscaPorEmail(email).then(objeto => {
                if (objeto) {
                    return Promise.reject('O email informado já está cadastrado.');
                }
            });
        }).optional(),
        c.validaSenha(notNULL),
        c.validaSalario(notNULL),
        c.validaCidade(notNULL),
        c.validaNivelAcesso(notNULL),
        c.validaBairro(notNULL),
        c.validaRua(notNULL),
        c.validaNumeroCasa(notNULL),
        c.validaTelefone(notNULL),
        c.validaDataNasc(notNULL),
        c.validaComplemento(false)
    ]
}

router.get("/", (req, res) => {
    console.log("buscando todas os funcionarios...")
    const DAO = new c.FuncionariosDAO(c.dbConnection)
    c.buscaTodos(req, res, DAO)
})

router.post("/funcionario", validacao(true), (req, res) => {
    console.log("cadastrando funcionario...")
    c.checkErros(req, res)
    let objeto = funcionarioFormato(req)
    const DAO = new c.FuncionariosDAO(c.dbConnection)
    const cidadesDAO = new c.CidadesDAO(c.dbConnection)
    
    bcrypt.hash(objeto.senha, 10)
        .then(
            (hash) => {
                objeto.senha = hash
                return cidadesDAO.buscaIdPeloNome(req.body.cidade)
            }
        )
        .then(
            (id) => {
                objeto.idCidade = id.id
                c.adicionaUm(req, res, objeto, DAO)
            }
        )

})

router.get("/funcionario/:id", (req, res) => {
    console.log(`buscando funcionario com id: ${req.params.id}...`)
    const DAO = new c.FuncionariosDAO(c.dbConnection)
    c.buscaUm(req, res, DAO)
})

router.delete("/funcionario/:id", (req, res) => {
    console.log(`deletando o funcionario com id: ${req.params.id}...`)
    const DAO = new c.FuncionariosDAO(c.dbConnection)
    c.deletaUm(req, res, DAO)
})

router.post("/funcionario/:id", validacao(false), (req, res) => {
    console.log(`atualizando funcionario com id: ${req.params.id}...`)
    c.checkErros(req, res)
    let objeto = formato(req)
    const DAO = new c.FuncionariosDAO(c.dbConnection)
    const cidadesDAO = new c.CidadesDAO(c.dbConnection)

    if (objeto.senha) {
        bcrypt.hash(objeto.senha, 10)
            .then(
                (hash) => {
                    objeto.senha = hash
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
                }
            )
    } else {
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
    }
})

module.exports = router