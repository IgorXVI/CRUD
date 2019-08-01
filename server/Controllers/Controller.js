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
const UrlDAO = require("../DAOs/UrlDAO")

const {
    body
} = require("express-validator/check")

const _ = require('lodash');

module.exports = class Controller {
    constructor(nome, nomeSingular, atributos, gerarTodasRotas) {
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
        this.urlDAO = new UrlDAO()

        this.masterDAO = this[`${_.camelCase(nome)}DAO`]

        this.urlDAO.atualizaPorTabela(`api/${nome}/${nomeSingular}`, _.camelCase(nome))

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
            (async () => {
                try {
                    this.inicio(req, res, `Buscando ${this.nome}...`)
                    await this.buscaTodos(req, res)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAdicionaUm(validacao) {
        this.router.post(`/${this.nomeSingular}`, validacao, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                    const objeto = this.gerarObjeto(req)
                    await this.adicionaUm(req, res, objeto)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaBuscaUm() {
        this.router.get(`/${this.nomeSingular}/:id`, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Buscando ${this.nomeSingular} com id = ${req.params.id}...`)
                    await this.buscaUm(req, res)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`/${this.nomeSingular}/:id`, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)
                    await this.deletaUm(req, res)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAtualizaUm(validacao) {
        this.router.post(`/${this.nomeSingular}/:id`, validacao, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                    const objeto = this.gerarObjeto(req)
                    await this.atualizaUm(req, res, objeto)
                } catch {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    async buscaTodos(req, res) {
        const DAO = this.masterDAO
        let arr = await DAO.buscaTodos()
        for(let i = 0; i < arr.length; i++){
            arr[i] = await this.buscaObjetoPorID(arr[i].id, DAO)
        }
        res.status(200).json({
            resultado: arr
        })
        this.fim()
    }

    async deletaUm(req, res) {
        const DAO = this.masterDAO
        await this.buscaObjetoPorID(req.params.id, DAO)
        await DAO.deletaPorID(req.params.id)
        res.status(202).end()
        this.fim()
    }

    async buscaUm(req, res) {
        const DAO = this.masterDAO
        let objeto = await this.buscaObjetoPorID(req.params.id, DAO)
        res.status(200).json({
            resultado: objeto
        })
        this.fim()
    }

    async adicionaUm(req, res, objeto) {
        const DAO = this.masterDAO
        await DAO.adiciona(objeto)
        res.status(201).end()
        this.fim()
    }

    async atualizaUm(req, res, objeto) {
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
    }

    async buscaObjetoPorID(id, DAO) {
        let objeto = await DAO.buscaPorID(id)
        if (!objeto) {
            throw new Error("Erro no ID.");
        } else {
            objeto = await this.converterForeignKeyEmJSON(objeto)
            return objeto
        }
    }

    async converterForeignKeyEmJSON(objetoRecebido) {
        let objeto = objetoRecebido
        const keys = Object.keys(objeto)
        for (let i = 0; i < keys.length; i++) {
            if (this.ehForeignKey(keys[i])) {
                let nome = keys[i].slice(2)
                nome = `${nome.charAt(0).toLowerCase()}${nome.slice(1)}`

                let url = await this.urlDAO.buscaPorTabela(nome)
                url = url.urlString
                url = `${url}/${objeto[keys[i]]}`

                let resultado = await this.buscaObjetoPorID(objeto[keys[i]], this[`${_.camelCase(nome)}DAO`])

                let nomeSingular = url.replace(`/${nome}/`, ``)
                nomeSingular = nomeSingular.replace(`api`, ``)
                nomeSingular = nomeSingular.replace(`/${objeto[keys[i]]}`, ``)

                delete objeto[keys[i]] 
                objeto[nomeSingular] = resultado
            }
        }
        return objeto
    }

    ehForeignKey(campo) {
        return campo.charAt(0) === 'i' && campo.charAt(1) === 'd'  && campo.length > 2
    }

    lidarComErro(erroRecebido, req, res) {
        if (erroRecebido.message.includes("SQLITE_CONSTRAINT: FOREIGN KEY constraint failed")) {
            const erros = [{
                location: "params",
                param: "id",
                msg: "O valor informado está sendo usado como foreign key.",
                value: req.params.id
            }]
            res.status(400).json({
                erros
            })
        } else if (erroRecebido.message.includes("Erro no ID.")) {
            const erros = [{
                location: "params",
                param: "id",
                msg: "O valor informado não é válido.",
                value: req.params.id
            }]
            res.status(400).json({
                erros
            })
        } else if (erroRecebido.message.includes("Erro de validacao.")) {
            res.status(400).json({
                erros: req.validationErrors()
            })
        } else if (erroRecebido.message.includes("Erro dois itens de venda que possuem o mesmo produto e a mesma venda.")) {
            const erros = [{
                location: "body",
                param: "idProduto, idVenda",
                msg: "Não podem existir dois itens de venda que possuem o mesmo produto e a mesma venda.",
                value: [req.body.idVenda, req.body.idProduto]
            }]
            res.status(400).json({
                erros
            })
        } else if (erroRecebido.message.includes("Erro não existem produtos suficientes estocados para realizar essa venda.")) {
            const erros = [{
                location: "body",
                param: "idProduto",
                msg: "Não existem produtos suficientes estocados para realizar essa venda.",
                value: req.body.idProduto
            }]
            res.status(400).json({
                erros
            })
        } else if (erroRecebido.message.includes("Erro senha invalida.")) {
            const erros = [{
                location: "body",
                param: "senha",
                msg: "O valor não é válido.",
                value: req.body.senha
            }]
            res.status(400).json({
                erros
            })
            super.fim()
        } else if (erroRecebido.message.includes("Erro email ja cadastrado.")) {
            const erros = [{
                location: "body",
                param: "email",
                msg: "O valor informado já está cadastrado.",
                value: req.params.id
            }]
            res.status(400).json({
                erros
            })
        } else {
            console.log(erroRecebido)
            const erros = [{
                msg: "Erro no servidor."
            }]
            res.status(500).json({
                erros
            })
        }
        this.fim()
    }

    inicio(req, res, mensagem) {
        console.log(mensagem)
        const errosValidacao = req.validationErrors()
        if (errosValidacao) {
            throw new Error("Erro de validacao.")
        }
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

    validaCidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("cidade"))
        }
        validacoes.push(this.validaInteiro("cidade", 1).optional())
        validacoes.push(body("cidade").custom(id => {
            return this.cidadesDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaProduto(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("produto"))
        }
        validacoes.push(this.validaInteiro("produto", 1).optional())
        validacoes.push(body("produto").custom(id => {
            return this.produtosDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaFuncionario(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("funcionario"))
        }
        validacoes.push(this.validaInteiro("funcionario", 1).optional())
        validacoes.push(body("funcionario").custom(id => {
            return this.funcionariosDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaCliente(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("cliente"))
        }
        validacoes.push(this.validaInteiro("cliente", 1).optional())
        validacoes.push(body("cliente").custom(id => {
            return this.clientesDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaFornecedor(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("fornecedor"))
        }
        validacoes.push(this.validaInteiro("fornecedor", 1).optional())
        validacoes.push(body("fornecedor").custom(id => {
            return this.fornecedoresDAO.buscaPorID(id).then(objeto => {
                if (!objeto) {
                    return Promise.reject('O valor informado não está cadastrado.');
                }
            });
        }).optional())
        return validacoes
    }

    validaVenda(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("venda"))
        }
        validacoes.push(this.validaInteiro("venda", 1).optional())
        validacoes.push(body("venda").custom(id => {
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