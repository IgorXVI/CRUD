const express = require("express")

const dbConnection = require("../config/db")

const CidadesDAO = require("../DAO/CidadesDAO")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")
const ClientesDAO = require("../DAO/ClientesDAO")
const FornecedoresDAO = require("../DAO/FornecedoresDAO")
const ProdutosDAO = require("../DAO/ProdutosDAO")
const EstoqueDAO = require("../DAO/EstoqueDAO")
const VendasDAO = require("../DAO/VendasDAO")
const ItensVendaDAO = require("../DAO/ItensVendaDAO")
const UsuariosDAO = require("../DAO/UsuariosDAO")

const {
    body
} = require("express-validator/check")

module.exports = class Controller {
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO) {
        this.router = express.Router()

        this.cidadesDAO = new CidadesDAO(dbConnection)
        this.funcionariosDAO = new FuncionariosDAO(dbConnection)
        this.clientesDAO = new ClientesDAO(dbConnection)
        this.fornecedoresDAO = new FornecedoresDAO(dbConnection)
        this.produtosDAO = new ProdutosDAO(dbConnection)
        this.estoqueDAO = new EstoqueDAO(dbConnection)
        this.vendasDAO = new VendasDAO(dbConnection)
        this.itensVendaDAO = new ItensVendaDAO(dbConnection)
        this.usuariosDAO = new UsuariosDAO(dbConnection)

        this.masterDAO = masterDAO

        this.foreignKeys = {}

        this.atributos = atributos
        this.nome = nome
        this.nomeSingular = nomeSingular

        if (gerarTodasRotas) {
            this.gerarRotaBuscaTodos()
            this.gerarRotaBuscaUm()
            this.gerarRotaAdicionaUm()
            this.gerarRotaAtualizaUm()
            this.gerarRotaDeletaUm()
        }

    }

    gerarRotaBuscaTodos() {
        this.router.get("/", (req, res) => {
            this.inicio(req, res, `Buscando ${this.nome}...`)
            this.buscaTodos(req, res)
        })
    }

    gerarRotaAdicionaUm() {
        this.router.post(`/${this.nomeSingular}`, this.gerarValidacao(true), (req, res) => {
            this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
            const objeto = this.gerarObjeto()
            this.adicionaUm(req, res, objeto)
        })
    }

    gerarRotaBuscaUm() {
        this.router.get(`/${this.nomeSingular}/:id`, (req, res) => {
            this.inicio(req, res, `Buscando ${this.nomeSingular} com id = ${req.params.id}...`)
            this.buscaUm(req, res)
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`/${this.nomeSingular}/:id`, (req, res) => {
            this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)
            this.deletaUm(req, res)
        })
    }

    gerarRotaAtualizaUm() {
        this.router.post(`/${this.nomeSingular}/:id`, this.gerarValidacao(false), (req, res) => {
            this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
            const objeto = this.gerarObjeto()
            this.atualizaUm(req, res, objeto)
        })
    }

    buscaTodos(req, res) {
        const DAO = this.masterDAO

        DAO.buscaTodos()
            .then(
                (objeto) => {
                    res.status(201).json({
                        success: true,
                        buscado: objeto
                    })
                    this.fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    deletaUm(req, res) {
        const DAO = this.masterDAO

        DAO.buscaPorID(req.params.id)
            .then(
                (objeto) => {
                    if (!objeto) {
                        res.status(400).json({
                            success: false,
                            erro: "O atributo id informado não é válido."
                        })
                        this.fim()
                    }
                    return DAO.deletaPorID(req.params.id)
                }
            )
            .then(
                () => {
                    res.status(200).json({
                        success: true
                    })
                    this.fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    buscaUm(req, res) {
        const DAO = this.masterDAO

        DAO.buscaPorID(req.params.id)
            .then(
                (objeto) => {
                    if (!objeto) {
                        res.status(400).json({
                            success: false,
                            erro: "O id informado não é válido."
                        })
                        this.fim()
                    }

                    res.status(200).json({
                        success: true,
                        buscado: objeto
                    })
                    this.fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    adicionaUm(req, res, objeto) {
        const DAO = this.masterDAO

        DAO.adiciona(objeto)
            .then(
                () => {
                    res.status(201).json({
                        success: true,
                        adicionado: objeto
                    })
                    this.fim()
                }
            )
            .catch(
                erro => this.erroServidor(erro, res)
            )
    }

    atualizaUm(req, res, objeto) {
        const DAO = this.masterDAO

        delete objeto.dataCriacao

        DAO.buscaPorID(req.params.id)
            .then(
                (objetoDB) => {
                    if (!objetoDB) {
                        res.status(400).json({
                            success: false,
                            erro: "O id informado não é válido."
                        })
                        this.fim()
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
                    this.fim()
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
            this.fim()
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

    inicio(req, res, mensagem) {
        console.log(mensagem)
        this.checkErros(req, res)
    }

    fim() {
        console.log("fim")
        return
    }

    gerarValidacao(obrigatorio, excecoes) {
        if(!excecoes){
            excecoes = new String()
        }

        const atributosArr = this.atributos.split(",").map(atributo => (atributo).replace(/\s/g,'')).map(atributo => `${atributo.charAt(0).toUpperCase()}${atributo.slice(1)}`)
        let validacao = new Array() 
        for (let i = 0; i < atributosArr.length; i++) {

            if(!("DataAlteracao, DataCriacao".includes(atributosArr[i]))){

                if ((excecoes.includes(atributosArr[i]))) {
                    validacao.push(this[`valida${atributosArr[i]}`](!obrigatorio))
                } else {
                    validacao.push(this[`valida${atributosArr[i]}`](obrigatorio))
                }

            }

        }
        return validacao
    }

    gerarObjeto(req) {
        let objeto = {}
        const atributosArr = this.atributos.split(",").map(atributo => (atributo).replace(/\s/g,''))
        const foreignKeysArr = Object.keys(this.foreignKeys)
        for (let i = 0; i < atributosArr.length; i++) {

            if (foreignKeysArr.indexOf(atributosArr[i]) > -1) {
                objeto[atributosArr[i]] = this.foreignKeys[atributosArr[i]]
            } else {
                objeto[atributosArr[i]] = req.body[atributosArr[i]]
            }

        }
        objeto.dataAlteracao = this.dataDeHoje()
        objeto.dataCriacao = this.dataDeHoje()
        return objeto
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
                    return Promise.reject('O atributo cidade informado não está cadastrado.');
                } else {
                    this.foreignKeys.cidade = objeto.id
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
            return this.produtosDAO.buscaPorNome(nome).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O atributo produto informado não está cadastrado.');
                } else {
                    this.foreignKeys.produto = objeto.id
                }
            });
        }).optional())
        return validacoes
    }

    validaValorTotal(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("valorTotal"))
        }
        validacoes.push(this.validaDecimal("valorTotal", 0))
        return validacoes
    }

    validaFuncionario(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("funcionario"))
        }
        validacoes.push(body("funcionario", "O atributo funcionario informado está em um formato inválido.").isEmail().optional())
        validacoes.push(body("funcionario").custom(email => {
            return this.funcionariosDAO.buscaPorEmail(email).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O atributo funcionario informado não está cadastrado.');
                } else {
                    this.foreignKeys.funcionario = objeto.id
                }
            });
        }).optional())
        return validacoes
    }

    validaCliente(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("cliente"))
        }
        validacoes.push(body("cliente", "O atributo cliente informado está em um formato inválido.").isEmail().optional())
        validacoes.push(body("cliente").custom(email => {
            return this.clientesDAO.buscaPorEmail(email).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O atributo cliente informado não está cadastrado.');
                } else {
                    this.foreignKeys.cliente = objeto.id
                }
            });
        }).optional())
        return validacoes
    }

    validaFornecedor(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("fornecedor"))
        }
        validacoes.push(body("fornecedor", "O atributo fornecedor informado está em um formato inválido.").isEmail().optional())
        validacoes.push(body("fornecedor").custom(email => {
            return this.fornecedoresDAO.buscaPorEmail(email).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O atributo fornecedor informado não está cadastrado.');
                } else {
                    this.foreignKeys.cliente = objeto.id
                }
            });
        }).optional())
        return validacoes
    }

    validaCategoria(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("categoria"))
        }
        validacoes.push(this.validaMaxChars("categoria", 100))
        return validacoes
    }

    validaPrecoUnidade(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("precoUnidade"))
        }
        validacoes.push(this.validaDecimal("precoUnidade", 0))
        return validacoes
    }

    validaDescricao(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("descricao"))
        }
        validacoes.push(this.validaMaxChars("descricao", 255))
        return validacoes
    }

    validaGarantia(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("garantia"))
        }
        validacoes.push(this.validaInteiro("garantia", 0))
        return validacoes
    }

    validaDataFabric(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("dataFrabric"))
        }
        validacoes.push(this.validaDataISO8601("dataFabric").optional())
        return validacoes
    }

    validaDataValidade(obrigatorio){
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("dataValidade"))
        }
        validacoes.push(this.validaDataISO8601("dataValidade").optional())
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