const Controller = require("./Controller")
const ClientesDAO = require("../DAOs/ClientesDAO")

module.exports = class ClientesController extends Controller {
    constructor() {
        super(`clientes`, `cliente`, ['CPF',
            'nome',
            'email',
            'cidade',
            'dataAlteracao',
            'dataCriacao',
            'bairro',
            'rua',
            'numeroCasa',
            'telefone',
            'dataNasc',
            'complemento'
        ], true, new ClientesDAO())
    }

}