const PessoaJuridica = require("./PessoaJuridica")

module.exports = class Fornecedores extends PessoaJuridica {
    constructor() {
        super("fornecedor", "fornecedores")
    }
}