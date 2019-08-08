const Controller = require("./Controller")
const DAOs = require("../DAOs/DAOs")
const { body } = require("express-validator/check")
module.exports = class ProdutosController extends Controller {
    constructor() {
        super(`produtos`, `produto`, [ 
        'nome',
        'categoria',
        'precoUnidade',
        'fornecedor',
        'descricao',
        'garantia',
        'dataFabricacao',
        'dataValidade'], true, new DAOs.ProdutosDAO())
    }

    validaNome(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("nome"))
        }
        validacoes.push(this.validaMinMaxChars("nome", 1, 100))
        return validacoes
    }

    validaCategoria(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("categoria"))
        }
        validacoes.push(this.validaMaxChars("categoria", 100))
        return validacoes
    }

    validaPrecoUnidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("precoUnidade"))
        }
        validacoes.push(this.validaDecimal("precoUnidade", 0))
        return validacoes
    }

    validaDescricao(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("descricao"))
        }
        validacoes.push(this.validaMaxChars("descricao", 255))
        return validacoes
    }

    validaGarantia(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("garantia"))
        }
        validacoes.push(this.validaInteiro("garantia", 0))
        return validacoes
    }

    validaDataFabricacao(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("dataFabric"))
        }
        validacoes.push(this.validaDataISO8601("dataFabric"))
        return validacoes
    }

    validaDataValidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("dataValidade"))
        }
        validacoes.push(this.validaDataISO8601("dataValidade"))
        return validacoes
    }

    validaFornecedor(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("fornecedor"))
        }
        validacoes.push(this.validaInteiro("fornecedor", 1))
        validacoes.push(body("fornecedor").custom(id => {
            (async () => {
                const fornecedoresDAO = new DAOs.FornecedoresDAO()
                const objeto = await fornecedoresDAO.buscaPorID(id)
                if (!objeto) {
                    throw new Error(`O valor informado não está cadastrado.`);
                }
            })()
        }).optional())
        return validacoes
    }

}