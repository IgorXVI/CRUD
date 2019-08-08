const Controller = require("./Controller")
const DAOs = require("../DAOs/DAOs")
const { body } = require("express-validator/check")

module.exports = class AlgoComEnderecoController extends Controller{
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO){
        super(nome, nomeSingular, [
        'cidade',
        'bairro',
        'rua',
        'numeroCasa',
        'telefone',
        'complemento' ].concat(atributos), gerarTodasRotas, masterDAO)
    }

    validaBairro(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("bairro"))
        }
        validacoes.push(this.validaMaxChars("bairro", 25))
        return validacoes
    }
    
    validaRua(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("rua"))
        }
        validacoes.push(this.validaMaxChars("rua", 25))
        return validacoes
    }
    
    validaNumeroCasa(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("numeroCasa"))
        }
        validacoes.push(this.validaInteiro("numeroCasa", 0, 1000000))
        return validacoes
    }
    
    validaComplemento(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("complemento"))
        }
        validacoes.push(this.validaMaxChars("complemento", 150))
        return validacoes
    }
    
    validaTelefone(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("telefone"))
        }
        validacoes.push(this.validaMaxChars("telefone", 15))
        validacoes.push(body("telefone", "O valor deve estar no formato de telefone.").matches(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/).optional())
        return validacoes
    }

    validaCidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("cidade"))
        }
        validacoes.push(this.validaInteiro("cidade", 1))
        validacoes.push(body("cidade").custom(id => {
            (async () => {
                const cidadesDAO = new DAOs.CidadesDAO()
                const objeto = await cidadesDAO.buscaPorID(id)
                if (!objeto) {
                    throw new Error(`O valor informado não está cadastrado.`);
                }
            })()
        }).optional())
        return validacoes
    }

}