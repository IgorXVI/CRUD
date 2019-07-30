const express = require("express")

const CidadesDAO = require("../DAOs/CidadesDAO")
const FuncionariosDAO = require("../DAOs/FuncionariosDAO")
const ClientesDAO = require("../DAOs/ClientesDAO")
const FornecedoresDAO = require("../DAOs/FornecedoresDAO")
const ProdutosDAO = require("../DAOs/ProdutosDAO")
const EstoqueDAO = require("../DAOs/EstoqueDAO")
const VendasDAO = require("../DAOs/VendasDAO")
const ItensVendaDAO = require("../DAOs/ItensVendaDAO")
const UsuariosDAO = require("../DAOs/UsuariosDAO")

const {
    body
} = require("express-validator/check")

module.exports = class Controller {
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO) {
        this.router = express.Router()

        this.cidadesDAO = new CidadesDAO()
        this.funcionariosDAO = new FuncionariosDAO()
        this.clientesDAO = new ClientesDAO()
        this.fornecedoresDAO = new FornecedoresDAO()
        this.produtosDAO = new ProdutosDAO()
        this.estoqueDAO = new EstoqueDAO()
        this.vendasDAO = new VendasDAO()
        this.itensVendaDAO = new ItensVendaDAO()
        this.usuariosDAO = new UsuariosDAO()

        this.masterDAO = masterDAO

        this.atributos = atributos
        this.nome = nome
        this.nomeSingular = nomeSingular

        this.body = body

        if (gerarTodasRotas) {
            this.gerarRotaBuscaTodos()
            this.gerarRotaBuscaUm()
            this.gerarRotaAdicionaUm(this.gerarValidacao(true))
            this.gerarRotaAtualizaUm(this.gerarValidacao(false))
            this.gerarRotaDeletaUm()
        }

    }

    gerarRotaBuscaTodos() {
        this.router.get("/", (req, res) => {
            if (this.inicio(req, res, `Buscando ${this.nome}...`)) {
                this.buscaTodos(req, res)
            }
        })
    }

    gerarRotaAdicionaUm(validacao) {
        this.router.post(`/${this.nomeSingular}`, validacao, (req, res) => {
            if (this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)) {
                const objeto = this.gerarObjeto(req)
                this.adicionaUm(req, res, objeto)
            }
        })
    }

    gerarRotaBuscaUm() {
        this.router.get(`/${this.nomeSingular}/:id`, (req, res) => {
            if (this.inicio(req, res, `Buscando ${this.nomeSingular} com id = ${req.params.id}...`)) {
                this.buscaUm(req, res)
            }
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`/${this.nomeSingular}/:id`, (req, res) => {
            if (this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)) {
                this.deletaUm(req, res)
            }
        })
    }

    gerarRotaAtualizaUm(validacao) {
        this.router.post(`/${this.nomeSingular}/:id`, validacao, (req, res) => {
            if (this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)) {
                const objeto = this.gerarObjeto(req)
                this.atualizaUm(req, res, objeto)
            }
        })
    }

    async buscaTodos(req, res) {
        try {
            const DAO = this.masterDAO
            const objeto = await DAO.buscaTodos()
            res.status(200).json({
                resultado: objeto
            })
            this.fim()
        } catch (erro) {
            this.lidarComErro(erro, res)
        }
    }

    async deletaUm(req, res) {
        try {
            const DAO = this.masterDAO
            await this.buscaObjetoPorID(req.params.id, DAO)
            await DAO.deletaPorID(req.params.id)
            res.status(202).end()
            this.fim()
        } catch (erro) {
            this.lidarComErro(erro, res)
        }
    }

    async buscaUm(req, res) {
        try {
            const DAO = this.masterDAO
            const objeto = await this.buscaObjetoPorID(req.params.id, DAO)
            res.status(200).json({
                resultado: objeto
            })
            this.fim()
        } catch (erro) {
            this.lidarComErro(erro, res)
        }
    }

    async adicionaUm(req, res, objeto) {
        try {
            const DAO = this.masterDAO
            await DAO.adiciona(objeto)
            res.status(201).end()
            this.fim()
        } catch (erro) {
            this.lidarComErro(erro, res)
        }
    }

    async atualizaUm(req, res, objeto) {
        try {
            const DAO = this.masterDAO
            delete objeto.dataCriacao
            const objetoDB = await this.buscaObjetoPorID(req.params.id, DAO)
            const keys = Object.keys(objeto)
            let keysDB = Object.keys(objetoDB)
            keysDB.shift()
            for (let i = 0; i < keys.length; i++) {
                if (!objeto[keys[i]]) {
                    objeto[keys[i]] = objetoDB[keysDB[i]]
                }
            }
            await DAO.atualizaPorID(objeto, req.params.id)
            res.status(201).end()
            this.fim()
        } catch (erro) {
            this.lidarComErro(erro, res)
        }
    }

    async buscaObjetoPorID(id, DAO) {
        const objeto = await DAO.buscaPorID(id)
        if (!objeto) {
            throw new Error("Erro no ID.");
        } else {
            return objeto
        }
    }

    lidarComErro(erroRecebido, res) {
        if (erroRecebido.message.includes("SQLITE_CONSTRAINT: FOREIGN KEY constraint failed")) {
            const erro = [{
                location: "params",
                param: "id",
                msg: "O valor informado está sendo usado como foreign key.",
                value: req.params.id
            }]
            res.status(400).json({
                erro
            })
        } else if (erroRecebido.message.includes("Erro no ID.")) {
            const erro = [{
                location: "params",
                param: "id",
                msg: "O valor informado não é válido.",
                value: req.params.id
            }]
            res.status(400).json({
                erro
            })
        } else {
            console.error(erroRecebido)
            const erro = [{
                msg: "Erro no servidor."
            }]
            res.status(500).json({
                erro
            })
        }
        this.fim()
    }

    checkErrosValidacao(req, res) {
        const erro = req.validationErrors()
        if (erro) {
            res.status(400).json({
                erro
            })
            this.fim()
            return true
        }
        return false
    }

    inicio(req, res, mensagem) {
        console.log(mensagem)
        return !this.checkErrosValidacao(req, res)
    }

    fim() {
        console.log("fim")
    }

    gerarValidacao(obrigatorio, excecoes) {
        let excecoesArr = []
        if (excecoes) {
            excecoesArr = excecoes.map(excecao => `${excecao.charAt(0).toUpperCase()}${excecao.slice(1)}`)
        }

        const atributosArr = this.atributos.map(atributo => `${atributo.charAt(0).toUpperCase()}${atributo.slice(1)}`)

        let validacao = new Array()
        
        for (let i = 0; i < atributosArr.length; i++) {

            if (!(atributosArr[i] == "DataCriacao" || atributosArr[i] == "DataAlteracao")) {
                if ((excecoesArr.includes(atributosArr[i]))) {
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
        for (let i = 0; i < this.atributos.length; i++) {
            objeto[this.atributos[i]] = req.body[this.atributos[i]]
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
        validacoes.push(body("CPF", "O valor deve estar no formato xxx.xxx.xxx-xx, onde x é um dígito.").matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/).optional())
        return validacoes
    }

    validaNome(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("nome"))
        }
        validacoes.push(this.validaMinMaxChars("nome", 1, 100).optional())
        return validacoes
    }

    validaEmail(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("email"))
        }
        validacoes.push(this.validaMaxChars("email", 255).optional())
        validacoes.push(body("email", "O valor informado está em um formato inválido.").isEmail().optional())
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
        validacoes.push(body("telefone", "O valor deve estar no formato (xx) xxxxx-xxxx, onde x é um dígito.").matches(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/).optional())
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
        validacoes.push(body("CEP", "O valor deve estar no formato xxxxx-xxx, onde x é um dígito.").matches(/^[0-9]{5}-[\d]{3}$/).optional())
        return validacoes
    }

    validaCNPJ(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("CNPJ"))
        }
        validacoes.push(this.validaFixoChars("CNPJ", 18).optional())
        validacoes.push(body("CNPJ", "O valor deve estar no formato xx.xxx.xxx/xxxx-xx, onde x é um dígito.").matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/).optional())
        return validacoes
    }

    validaQuantidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("quantidade"))
        }
        validacoes.push(this.validaInteiro("quantidade", 0).optional())
        return validacoes
    }

    validaValorTotal(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("valorTotal"))
        }
        validacoes.push(this.validaDecimal("valorTotal", 0).optional())
        return validacoes
    }

    validaCategoria(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("categoria"))
        }
        validacoes.push(this.validaMaxChars("categoria", 100).optional())
        return validacoes
    }

    validaPrecoUnidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("precoUnidade"))
        }
        validacoes.push(this.validaDecimal("precoUnidade", 0).optional())
        return validacoes
    }

    validaDescricao(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("descricao"))
        }
        validacoes.push(this.validaMaxChars("descricao", 255).optional())
        return validacoes
    }

    validaGarantia(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("garantia"))
        }
        validacoes.push(this.validaInteiro("garantia", 0).optional())
        return validacoes
    }

    validaDataFabric(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("dataFabric"))
        }
        validacoes.push(this.validaDataISO8601("dataFabric").optional())
        return validacoes
    }

    validaDataValidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("dataValidade"))
        }
        validacoes.push(this.validaDataISO8601("dataValidade").optional())
        return validacoes
    }

    validaIdCidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("idCidade"))
        }
        validacoes.push(this.validaInteiro("idCidade", 1).optional())
        validacoes.push(body("idCidade").custom(id => {
            return this.cidadesDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaIdProduto(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("idProduto"))
        }
        validacoes.push(this.validaInteiro("idProduto", 1).optional())
        validacoes.push(body("idProduto").custom(id => {
            return this.produtosDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaIdFuncionario(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("idFuncionario"))
        }
        validacoes.push(this.validaInteiro("idFuncionario", 1).optional())
        validacoes.push(body("idFuncionario").custom(id => {
            return this.funcionariosDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaIdCliente(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("idCliente"))
        }
        validacoes.push(this.validaInteiro("idCliente", 1).optional())
        validacoes.push(body("idCliente").custom(id => {
            return this.clientesDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaIdFornecedor(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("idFornecedor"))
        }
        validacoes.push(this.validaInteiro("idFornecedor", 1).optional())
        validacoes.push(body("idFornecedor").custom(id => {
            return this.fornecedoresDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaIdVenda(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("idVenda"))
        }
        validacoes.push(this.validaInteiro("idVenda", 1).optional())
        validacoes.push(body("idVenda").custom(id => {
            return this.vendasDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaCampoUnico(DAO, campo) {
        return body(campo).custom(valor => {
            return DAO.buscaPorColuna(valor, campo).then(objeto => {
                if (objeto) {
                    return Promise.reject(`O valor informado já está cadastrado.`);
                }
            });
        }).optional()
    }

    validaNotNull(atributo) {
        return body(atributo, `É necessário informar o valor.`).exists()
    }

    validaFixoChars(atributo, valor) {
        return body(atributo, `O valor deve conter ${valor} caractéres.`).isLength({
            min: valor,
            max: valor
        })
    }

    validaMaxChars(atributo, maximo) {
        return body(atributo, `O valor deve conter no máximo ${maximo} caractéres.`).isLength({
            max: maximo
        })
    }

    validaMinMaxChars(atributo, minimo, maximo) {
        return body(atributo, `O valor deve conter no mínimo ${minimo} e no máximo ${maximo} caractéres.`).isLength({
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

        return body(atributo, `O valor deve ser um número de ponto flutuante, com um ponto separando a parte inteira da parte decimal, e estar entre ${minimo} e ${maximo}`).isFloat({
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

        return body(atributo, `O valor deve ser um número inteiro e estar entre ${minimo} e ${maximo}`).isFloat({
            min: minimo,
            max: maximo
        })
    }

    validaDataISO8601(atributo) {
        return body(atributo, `O valor deve estar no formato aaaa-mm-dd, onde a é o ano, m é o mês e d é o dia.`).isISO8601()
    }

    dataDeHoje() {
        return new Date().toISOString()
    }

}