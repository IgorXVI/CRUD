const Usuarios = require("./Usuarios")

module.exports = class Funcionarios extends Usuarios {
    constructor(){
        super("funcionario", "funcionarios")
        this._salario = 0
    }

    async salario(novoSalario) {
        await this._validaNotNull("salario", novoSalario)
        await this._validaDecimal("salario", novoSalario, 0)
        this._salario = novoSalario
    }

}