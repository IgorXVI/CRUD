const PessoaFisicaController = require("./PessoaFisicaController")
const ClientesDAO = require("../DAOs/ClientesDAO")

module.exports = class ClientesController extends PessoaFisicaController {
    constructor() {
        super(`clientes`, `cliente`, [], true, new ClientesDAO())
    }

}