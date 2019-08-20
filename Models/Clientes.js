const Usuarios = require("./Usuarios")

module.exports = class Clientes extends Usuarios {
    constructor(){
        super("cliente", "clientes", [])
    }
} 