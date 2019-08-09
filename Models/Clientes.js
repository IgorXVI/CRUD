const PessoaFisica = require("./PessoaFisica")

module.exports = class Clientes extends PessoaFisica {
    constructor(){
        super("cliente", "clientes")
    }
} 