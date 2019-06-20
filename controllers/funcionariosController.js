const bcrypt = require("bcrypt")
const g = require("./globalFunctions")

const {
    body
} = require("express-validator/check")

const router = g.express.Router()

router.get("/", (req, res) => {
    console.log("buscando todas os funcionarios...")
    const funcionariosDAO = new g.FuncionariosDAO(g.dbConnection)
    funcionariosDAO.buscaTodos()
        .then(
            (funcionarios) => {
                res.status(201).json({
                    success: true,
                    funcionarios
                })
                g.fim()
                return
            }
        )
        .catch(
            (erro) => {
                console.log(erro)
                res.status(500).json({
                    success: false,
                    erro: "Erro no servidor."
                })
                g.fim()
                return
            }
        )
})

router.post("/funcionario", [
    g.validaCPF(true),
    g.validaNome(true),
    g.validaEmail(true),
    body("email").custom(email => {
        const DAO = new g.FuncionariosDAO(g.dbConnection)
        return DAO.buscaPorEmail(email).then(funcionario => {
            if (funcionario) {
                return Promise.reject('O email informado já está cadastrado.');
            }
        });
    }).optional(),
    g.validaSenha(true),
    g.validaSalario(true),
    g.validaCidade(true),
    g.validaNivelAcesso(true),
    g.validaBairro(true),
    g.validaRua(true),
    g.validaNumeroCasa(true),
    g.validaComplemento(false),
    g.validaTelefone(true),
    g.validaDataNasc(true)
], (req, res) => {
    console.log("cadastrando funcionario")

    const errosValidacao = req.validationErrors()
    if (errosValidacao) {
        res.status(400).json({
            success: false,
            errosValidacao
        })
        g.fim()
        return
    }

    let funcionario = {
        CPF: req.body.CPF,
        nome: req.body.nome,
        email: req.body.email,
        senha: undefined,
        salario: req.body.salario,
        idCidade: undefined,
        nivelAcesso: req.body.nivelAcesso,
        dataAlteracao: g.dataDeHoje(),
        dataCriacao: g.dataDeHoje(),
        bairro: req.body.bairro,
        rua: req.body.rua,
        numeroCasa: req.body.numeroCasa,
        telefone: req.body.telefone,
        dataNasc: req.body.dataNasc,
        complemento: req.body.complemento
    }

    const cidadesDAO = new g.CidadesDAO(g.dbConnection)
    const funcionariosDAO = new g.FuncionariosDAO(g.dbConnection)

    bcrypt.hash(req.body.senha, 10)
        .then(
            (hash) => {
                funcionario.senha = hash
                return cidadesDAO.buscaIdPeloNome(req.body.cidade)
            }
        )
        .then(
            (id) => {
                funcionario.idCidade = id.id
                return funcionariosDAO.adiciona(funcionario)
            }
        )
        .then(
            () => {
                res.status(200).json({
                    success: true,
                    funcionario
                })
                g.fim()
                return
            }
        )
        .catch(
            (erro) => {
                console.log(erro)
                res.status(500).json({
                    success: false,
                    erro: "Erro no servidor."
                })
                g.fim()
                return
            }
        )

})

router.get("/funcionario/:id", (req, res)=>{
    console.log(`buscando funcionario com id: ${req.params.id}...`)

    const funcionarioDAO = new g.FuncionariosDAO(g.dbConnection)
    funcionarioDAO.buscaPorID(req.params.id)
    .then(
        (funcionario)=>{
            if(!funcionario){
                res.status(400).json({
                    success: false,
                    erro: "O id informado não é válido."
                })
                g.fim()
                return
            }

            res.status(200).json({
                success: true,
                funcionario
            })
            g.fim()
            return
        }
    )
    .catch(
        (erro)=>{
            console.log(erro)
            res.status(500).json({
                success: false,
                erro: "Erro no servidor."
            })
            g.fim()
            return
        }
    )
})

router.delete("/funcionario/:id", (req, res)=>{
    console.log(`deletando o funcionario com id: ${req.params.id}...`)

    const funcionarioDAO = new g.FuncionariosDAO(g.dbConnection)
    funcionarioDAO.buscaPorID(req.params.id)
    .then(
        (funcionario)=>{
            if(!funcionario){
                res.status(400).json({
                    success: false,
                    erro: "O id informado não é válido."
                })
                g.fim()
                return
            }
            return funcionarioDAO.deletaPorID(req.params.id)
        }
    )
    .then(
        ()=>{
            res.status(200).json({
                success: true
            })
            g.fim()
            return
        }
    )
    .catch(
        (erro)=>{
            console.log(erro)
            res.status(500).json({
                success: false,
                erro: "Erro no servidor."
            })
            g.fim()
            return
        }
    )
})

router.post("/funcionario/:id", [
    g.validaCPF(false),
    g.validaNome(false),
    g.validaEmail(false),
    body("email").custom(email => {
        const DAO = new g.FuncionariosDAO(g.dbConnection)
        return DAO.buscaPorEmail(email).then(funcionario => {
            if (funcionario) {
                return Promise.reject('O email informado já está cadastrado.');
            }
        });
    }).optional(),
    g.validaSenha(false),
    g.validaSalario(false),
    g.validaCidade(false),
    g.validaNivelAcesso(false),
    g.validaBairro(false),
    g.validaRua(false),
    g.validaNumeroCasa(false),
    g.validaComplemento(false),
    g.validaTelefone(false),
    g.validaDataNasc(false)
], (req, res)=>{
    console.log(`atualizando funcionario com id: ${req.params.id}...`)

    const errosValidacao = req.validationErrors()
    if (errosValidacao) {
        res.status(400).json({
            success: false,
            errosValidacao
        })
        g.fim()
        return
    }

    let funcionario = {
        CPF: req.body.CPF,
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        salario: req.body.salario,
        idCidade: undefined,
        nivelAcesso: req.body.nivelAcesso,
        dataAlteracao: g.dataDeHoje(),
        dataCriacao: undefined,
        bairro: req.body.bairro,
        rua: req.body.rua,
        numeroCasa: req.body.numeroCasa,
        telefone: req.body.telefone,
        dataNasc: req.body.dataNasc,
        complemento: req.body.complemento
    }

    if(funcionario.senha){
        funcionario.senha = bcrypt.hashSync(funcionario.senha, 10)
    }

    const funcionarioDAO = new g.FuncionariosDAO(g.dbConnection)
    funcionarioDAO.buscaPorID(req.params.id)
    .then(
        (funcionarioDB)=>{
            if(!funcionarioDB){
                res.status(400).json({
                    success: false,
                    erro: "O id informado não é válido."
                })
                g.fim()
                return
            }

            const keys = Object.keys(funcionario)
            for(let i = 0; i < keys.length; i++){
                if(!funcionario[keys[i]]){
                    funcionario[keys[i]] = funcionarioDB[keys[i]]
                }
            }
            return funcionarioDAO.atualiza(funcionario, req.params.id)
        }
    )
    .then(
        ()=>{
            res.status(200).json({
                success: true,
                funcionario
            })
            g.fim()
            return
        }
    )
    .catch(
        (erro)=>{
            console.log(erro)
            res.status(500).json({
                success: false,
                erro: "Erro no servidor."
            })
            g.fim()
            return
        }
    )

}) 

module.exports = router