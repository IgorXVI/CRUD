const UsuariosController = require("./UsuariosController")
const FuncionariosDAO = require("../DAOs/FuncionariosDAO")
module.exports = class FuncionariosController extends UsuariosController{
    constructor(){
        super(`funcionarios`, `funcionario`, ['salario'], true, new FuncionariosDAO())
    }

    validaSalario(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("salario"))
        }
        validacoes.push(this.validaDecimal("salario", 0))
        return validacoes
    }

}