const Usuarios = require("./Usuarios")

module.exports = class Funcionarios extends Usuarios {
    constructor() {
        super("funcionario", "funcionarios")

        Object.assign(this.attrs, {
            salario: {
                validacao: this._validaSalario,
                sql: `REAL NOT NULL`
            }
        })

        this._gerarSchema()
    }

    async _validaSalario(novoSalario, local) {
        await this._validaNotNull("salario", novoSalario, local)
        await this._validaDecimal("salario", novoSalario, 0, undefined, local)
    }

}