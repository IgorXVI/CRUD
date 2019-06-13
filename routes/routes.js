const dbConnection = require("../db")
const CidadesDAO = require("../DAO/CidadesDAO")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")
const bcrypt = require("bcrypt")

module.exports = (app) => {
    app.post("/cadastro/funcionario", (req, res) => {
        console.log("Cadastrando Funcionario...")

        req.assert("cpf", "É necessário informar o cpf.").notEmpty()
        req.assert("cpf", "O CPF deve ser um número inteiro.").isInt()
        req.assert("cpf", "O CPF deve conter apenas 14 caractéres.").isLength({
            min: 11,
            max: 11
        })

        req.assert("nome", "É necessário informar o nome.").notEmpty()

        req.assert("email", "É necessário informar o email.").notEmpty()
        req.assert("email", "O email informado está em um formato inválido.").isEmail()

        req.assert("senha", "É necessário informar a senha.").notEmpty()
        req.assert("senha", "A senha deve ter ao menos 8 caractéres.").isLength({
            min: 8
        })

        req.assert("salario", "É necessário informar o salário.").notEmpty()
        req.assert("salario", "O salário deve estar no formato decimal, exemplo: 1.2 ou 452.12").isDecimal()

        req.assert("cidade", "É necessário informar o nome da cidade.").notEmpty()
        req.assert("cidade", "O nome da cidade deve conter apenas lentras.").isAlpha()

        req.assert("nivelAcesso", "É necessário informar o nível de acesso.").notEmpty()
        req.assert("nivelAcesso", "O nível de acesso deve ser um número inteiro.").isInt()

        if (req.body.endereco) {
            req.assert("endereco", "O endereço pode conter no máximo 255 caractéres.").isLength({
                max: 255
            })
        }

        if (req.body.telefone) {
            req.assert("telefone", "O número de telefone pode conter no máximo 15 caractéres.").isLength({
                max: 15
            })
        }

        if (req.body.dataNasc) {
            req.assert("dataNasc", "A data de nascimento deve estar no formato aaaa-mm-dd.").isISO8601()
        }

        const errosValidacao = req.validationErrors()
        if (errosValidacao) {
            res.status(400).json({
                sucesso: false,
                errosValidacao
            })
            return
        }

        const hashSenha = ""
        hashingSenha(req.body.senha)
        .then(
            (hash)=>{
                hashSenha = hash
            }
        )
        cacth(
            (erro)=>{
                res.status(500).json({
                    sucesso: false,
                    erro
                })
                return
            }
        )

        const cidadeID = idCidadePeloNome(req.body.cidade)
        if (!cidadeID) {
            res.status(500).json({
                sucesso: false,
                erro: "Erro ao buscar a cidade."
            })
            return
        }

        const dataDeHoje = dataDeHojeParaMySQL()

        const funcionario = {
            cpf: req.body.cpf,
            nome: req.body.nome,
            email: req.body.email,
            senha: hashSenha,
            salario: req.body.salario,
            idCidade: cidadeID,
            nivelAcesso: req.body.nivelAcesso,
            dataCriacao: dataDeHoje,
            dataAlteracao: dataDeHoje,
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
                    console.log(erro)
                    res.send(500).json({
                        sucesso: false,
                        erro: "Erro ao cadastrar o funcionario."
                    })
                    return
                }
            )
    })
}

function hashingSenha(senha) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(senha, 10, (err, hash) => {
            if (err) {
                console.log(err)
                reject(new Error("Erro no hashing."))
            }
            else{
                resolve(hash)
            }
        });
    })
}

function dataDeHojeParaMySQL() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function idCidadePeloNome(nomeCidade) {
    const cidadesDAO = new CidadesDAO(dbConnection)
    cidadesDAO.getID(nomeCidade)
        .then(
            (id) => {
                return id
            }
        )
        .catch(
            (erro) => {
                console.log(erro)
                return null
            }
        )
}