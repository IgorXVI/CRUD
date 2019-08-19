const Usuarios = require("./Usuarios")

module.exports = class Funcionarios extends Usuarios {
    constructor(){
        super("funcionario", "funcionarios")
    }

    async salarioAttr(novoSalario, local) {
        await this._validaNotNull("salario", novoSalario, local)
        await this._validaDecimal("salario", novoSalario, 0, undefined, local)
        return novoSalario
    }

}