const bcrypt = require("bcrypt")

const dbConnection = require("../Banco de Dados")

const CidadesDAO = require("../DAO/CidadesDAO")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")

router.post("/cadastro/funcionario", (req, res) => {
    console.log("Cadastrando Funcionario...")

    const errosValidacao = req.validationErrors()
    if (errosValidacao) {
        res.status(400).json({
            sucesso: false,
            errosValidacao
        })
        return
    }

    let hashSenha = ""

    const cidade = (buscarCidade(req.body.cidade)).id
    if (cidade == null) {
        res.status(500).json({
            sucesso: false,
            erro: "Erro ao buscar a cidade."
        })
        return
    } else if (cidade.length == 0) {
        res.status(400).json({
            sucesso: false,
            erro: "Cidade não está cadastrada."
        })
        return
    }

    const funcionario = {
        cpf: req.body.cpf,
        nome: req.body.nome,
        email: req.body.email,
        senha: hashSenha,
        salario: req.body.salario,
        idCidade: cidadeID,
        nivelAcesso: req.body.nivelAcesso,
        dataCriacao: dataDeHoje(),
        dataAlteracao: dataDeHoje(),
        endereco: req.body.endereco,
        telefone: req.body.telefone,
        dataNasc: req.body.dataNasc,
    }

    const funcionariosDAO = new FuncionariosDAO(dbConnection)
    funcionariosDAO.add(funcionario)
        .then(
            (funcionarioCadastrado) => {
                res.send(201).json({
                    sucesso: true,
                    funcionarioCadastrado
                })
                return
            }
        )
        .catch(
            (erro) => {
                console.error(erro)
                res.send(500).json({
                    sucesso: false,
                    erro: "Erro ao cadastrar o funcionario."
                })
                return
            }
        )
})

function dataDeHoje() {
    return new Date().toISOString()
}

function buscarCidade(nome) {
    const cidadesDAO = new CidadesDAO(dbConnection)
    cidadesDAO.busca(nome)
        .then(
            (cidade) => {
                return cidade
            }
        )
        .catch(
            (erro) => {
                console.error(erro)
                return null
            }
        )
}
