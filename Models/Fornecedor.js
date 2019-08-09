const PessoaJuridica = require("./PessoaJuridica")

module.exports = class Fornecedor extends PessoaJuridica {
    constructor() {
        super("fornecedor", "fornecedores")
    }
}