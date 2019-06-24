const express = require("express")
const dbConnection = require("../config/db")
const CidadesDAO = require("../DAO/CidadesDAO")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")
const ClientesDAO = require("../DAO/ClientesDAO")
const FornecedoresDAO = require("../DAO/Fornecedores")
const ProdutosDAO = require("../DAO/ProdutosDAO")
const EstoqueDAO = require("../DAO/EstoqueDAO")
const VendasDAO = require("../DAO/VendasDAO")
const ItensVendaDAO = require("../DAO/ItensVendaDAO")
const {
    body
} = require("express-validator/check")

module.exports = class Controller {
    constructor(nomeSingular, atributos) {
        this.router = express.Router()
        this.cidadesDAO = new CidadesDAO(dbConnection)
        this.funcionariosDAO = new FuncionariosDAO(dbConnection)
        this.clientesDAO = new ClientesDAO(dbConnection)
        this.fornecedoresDAO = new FornecedoresDAO(dbConnection)
        this.produtosDAO = new ProdutosDAO(dbConnection)
        this.estoqueDAO = new EstoqueDAO(dbConnection)
        this.vendasDAO = new VendasDAO(dbConnection)
        this.itensVendaDAO = new ItensVendaDAO(dbConnection)
        this.atributos = atributos
        this.nome = nomeSingular
    }

    gerarRotaBuscaTodos(){
        this.router.get(`/${this.nome}s`, (req, res) => {
            this.buscaTodos(req, res)
        })
    }

    gerarRotaAdicionaUm(){
        this.router.post(`/${this.nome}s/${this.nome}`, validacao(true), (req, res) => {
            let objeto = this.gerarFormato(req)
            const DAO = new c.ClientesDAO(c.dbConnection)
            const cidadesDAO = new c.CidadesDAO(c.dbConnection)
        
            cidadesDAO.buscaPeloNome(req.body.cidade)
                .then(
                    (cidade) => {
                        objeto.idCidade = cidade.id
                        c.adicionaUm(req, res, objeto, DAO)
                    }
                )
        
        })
    }

    buscaTodos(req, res) {
        console.log(`buscando todos os ${this.nome}s...`)

        this.checkErros(req, res)

        const DAO = this[`${this.nome}sDAO`]

        DAO.buscaTodos()
            .then(
                (objeto) => {
                    res.status(201).json({
                        success: true,
                        buscado: objeto
                    })
                    fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    deletaUm(req, res) {
        console.log(`deletando o ${this.nome} com id = ${req.params.id}...`)

        this.checkErros(req, res)

        const DAO = this[`${this.nome}sDAO`]

        DAO.buscaPorID(req.params.id)
            .then(
                (objeto) => {
                    if (!objeto) {
                        res.status(400).json({
                            success: false,
                            erro: "O id informado não é válido."
                        })
                        fim()
                    }
                    return DAO.deletaPorID(req.params.id)
                }
            )
            .then(
                () => {
                    res.status(200).json({
                        success: true
                    })
                    fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    buscaUm(req, res) {
        console.log(`buscando o ${this.nome} com id = ${req.params.id}...`)

        this.checkErros(req, res)

        const DAO = this[`${this.nome}sDAO`]

        DAO.buscaPorID(req.params.id)
            .then(
                (objeto) => {
                    if (!objeto) {
                        res.status(400).json({
                            success: false,
                            erro: "O id informado não é válido."
                        })
                        fim()
                    }

                    res.status(200).json({
                        success: true,
                        buscado: objeto
                    })
                    fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    adicionaUm(req, res, objeto) {
        console.log(`adicionando um ${this.nome}...`)

        this.checkErros(req, res)

        const DAO = this[`${this.nome}sDAO`]

        DAO.adiciona(objeto)
            .then(
                () => {
                    res.status(201).json({
                        success: true,
                        adicionado: objeto
                    })
                    fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    atualizaUm(req, res, objeto) {
        console.log(`atualizando o ${this.nome} com id = ${req.params.id}...`)

        this.checkErros(req, res)

        const DAO = this[`${this.nome}sDAO`]

        delete objeto.dataCriacao

        DAO.buscaPorID(req.params.id)
            .then(
                (objetoDB) => {
                    if (!objetoDB) {
                        res.status(400).json({
                            success: false,
                            erro: "O id informado não é válido."
                        })
                        fim()
                    }

                    const keys = Object.keys(objeto)
                    for (let i = 0; i < keys.length; i++) {
                        if (!objeto[keys[i]]) {
                            objeto[keys[i]] = objetoDB[keys[i]]
                        }
                    }
                    return DAO.atualizaPorID(objeto, req.params.id)
                }
            )
            .then(
                () => {
                    res.status(200).json({
                        success: true,
                        atualizado: objeto
                    })
                    fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    checkErros(req, res) {
        const errosValidacao = req.validationErrors()
        if (errosValidacao) {
            res.status(400).json({
                success: false,
                errosValidacao
            })
            fim()
        }
    }

    erroServidor(erro, res) {
        console.error(erro)
        res.status(500).json({
            success: false,
            erro: "Erro no servidor."
        })
        this.fim()
    }

    fim() {
        console.log("fim")
        return
    }

    gerarFormato(req) {
        let formato = {}
        const atributosArr = this.atributos.split(",")
        for (let i = 0; i < atributosArr.length; i++) {
            formato[atributosArr[i]] = req.body[atributosArr[i]]
        }
        formato.dataAlteracao = this.dataDeHoje()
        formato.dataCriacao = this.dataDeHoje()
        return formato
    }

    gerarValidacao(obrigatorio, excecoes) {
        const atributosArr = this.atributos.split(",").map(atributo => atributo.charAt(0).toUpperCase() + atributo.slice(1))
        let validacao = new Array()
        for (let i = 0; i < atributosArr.length; i++) {
            if (!(atributosArr[i] in excecoes)) {
                validacao.push(this[`valida${atributosArr[i]}`](obrigatorio))
            }
        }
        return validacao
    }

    validaCPF(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("CPF"))
        }
        validacoes.push(this.validaFixoChars("CPF", 14).optional())
        validacoes.push(body("CPF", "O atributo cpf deve estar no formato xxx.xxx.xxx-xx, onde x é um dígito.").matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/).optional())
        return validacoes
    }

    validaNome(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("nome"))
        }
        validacoes.push(this.validaMaxChars("nome", 100).optional())
        return validacoes
    }

    validaEmail(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("email"))
        }
        validacoes.push(this.validaMaxChars("email", 255).optional())
        validacoes.push(body("email", "O atributo email informado está em um formato inválido.").isEmail().optional())
        validacoes.push(body("email").custom(email => {
            return this[`${this.nome}sDAO`].buscaPorEmail(email).then(objeto => {
                if (objeto) {
                    return Promise.reject('O email informado ja está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaSenha(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("senha"))
        }
        validacoes.push(this.validaMinMaxChars("senha", 8, 255).optional())
        return validacoes
    }

    validaSalario(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("salario"))
        }
        validacoes.push(this.validaDecimal("salario", 0).optional())
        return validacoes
    }

    validaCidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("cidade"))
        }
        validacoes.push(this.validaMaxChars("cidade", 30).optional())
        validacoes.push(body("cidade").custom(nome => {
            return this.cidadesDAO.buscaPeloNome(nome).then(objeto => {
                if (!objeto) {
                    return Promise.reject('A cidade informada não está cadastrada.');
                }
            });
        }).optional())
        return validacoes
    }

    validaNivelAcesso(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("nivelAcesso"))
        }
        validacoes.push(this.validaInteiro("nivelAcesso", 0, 2).optional())
        return validacoes
    }

    validaBairro(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("bairro"))
        }
        validacoes.push(this.validaMaxChars("bairro", 25).optional())
        return validacoes
    }

    validaRua(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("rua"))
        }
        validacoes.push(this.validaMaxChars("rua", 25).optional())
        return validacoes
    }

    validaNumeroCasa(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("numeroCasa"))
        }
        validacoes.push(this.validaInteiro("numeroCasa", 0, 1000000).optional())
        return validacoes
    }

    validaComplemento(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("complemento"))
        }
        validacoes.push(this.validaMaxChars("complemento", 150).optional())
        return validacoes
    }

    validaTelefone(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("telefone"))
        }
        validacoes.push(this.validaMaxChars("telefone", 15).optional())
        validacoes.push(body("telefone", "O atributo telefone deve estar no formato (xx) xxxxx-xxxx, onde x é um dígito.").matches(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/).optional())
        return validacoes
    }

    validaDataNasc(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("dataNasc"))
        }
        validacoes.push(this.validaMaxChars("dataNasc", 10).optional())
        validacoes.push(this.validaDataISO8601("dataNasc").optional())
        return validacoes
    }

    validaUF(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("UF"))
        }
        validacoes.push(this.validaFixoChars("UF", 2).optional())
        return validacoes
    }

    validaCEP(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("CEP"))
        }
        validacoes.push(this.validaFixoChars("CEP", 9).optional())
        return validacoes
    }

    validaCNPJ(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("CNPJ"))
        }
        validacoes.push(this.validaFixoChars("CNPJ", 18).optional())
        return validacoes
    }

    validaQuantidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("quantidade"))
        }
        validacoes.push(this.validaInteiro("quantidade", 0))
        return validacoes
    }

    validaProduto(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("produto"))
        }
        validacoes.push(this.validaMaxChars("produto", 100).optional())
        validacoes.push(body("produto").custom(nome => {
            return this.produtosDAO.buscaPeloNome(nome).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O produto informado não está cadastrada.');
                }
            });
        }).optional())
        return validacoes
    }

    validaNotNull(atributo) {
        return body(atributo, `É necessário informar o atributo ${atributo}.`).exists()
    }

    validaFixoChars(atributo, valor) {
        return body(atributo, `O atributo ${atributo} deve conter ${valor} caractéres.`).isLength({
            min: valor,
            max: valor
        })
    }

    validaMaxChars(atributo, maximo) {
        return body(atributo, `O atributo ${atributo} deve conter no máximo ${maximo} caractéres.`).isLength({
            max: maximo
        })
    }

    validaMinMaxChars(atributo, minimo, maximo) {
        return body(atributo, `O atributo ${atributo} deve conter no mínimo ${minimo} e no máximo ${maximo} caractéres.`).isLength({
            min: minimo,
            max: maximo
        })
    }

    validaDecimal(atributo, minimo, maximo) {
        if (minimo == null) {
            minimo = -1.79769e+308
        }

        if (maximo == null) {
            maximo = 1.79769e+308
        }

        return body(atributo, `O atributo ${atributo} deve ser um número de ponto flutuante, com um ponto separando a parte inteira da parte decimal, e conter um valor entre ${minimo} e ${maximo}`).isFloat({
            min: minimo,
            max: maximo
        })
    }

    validaInteiro(atributo, minimo, maximo) {
        if (minimo == null) {
            minimo = -9223372036854775808
        }

        if (maximo == null) {
            maximo = 9223372036854775808
        }

        return body(atributo, `O atributo ${atributo} deve ser um número inteiro e conter um valor entre ${minimo} e ${maximo}`).isFloat({
            min: minimo,
            max: maximo
        })
    }

    validaDataISO8601(atributo) {
        return body(atributo, `O atributo ${atributo} deve estar no formato aaaa-mm-dd, onde a é o ano, m é o mês e d é o dia.`).isISO8601()
    }

    dataDeHoje() {
        return new Date().toISOString()
    }

}