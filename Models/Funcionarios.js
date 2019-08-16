const Usuarios = require("./Usuarios")

module.exports = class Funcionarios extends Usuarios {
    constructor(){
        super("funcionario", "funcionarios")
    }

    async salarioAttr(novoSalario) {
        await this._validaNotNull("salario", novoSalario)
        await this._validaDecimal("salario", novoSalario, 0)
        return novoSalario
    }

}