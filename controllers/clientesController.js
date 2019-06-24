const Controller = require("./Controller")

module.exports = class ClientesController extends Controller {
    constructor() {
        super(`clientes`, `cliente`, `CPF, nome, email, cidade, dataAlteracao, dataCriacao, bairro, rua, numeroCasa, 
        telefone, dataNasc, complemento`, true)

        this.masterDAO = this.clientesDAO
    }
}