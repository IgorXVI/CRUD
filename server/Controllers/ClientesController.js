const Controller = require("./Controller")

module.exports = class ClientesController extends Controller {
    constructor() {
        super(`clientes`, `cliente`, ['CPF',
            'nome',
            'email',
            'idCidade',
            'dataAlteracao',
            'dataCriacao',
            'bairro',
            'rua',
            'numeroCasa',
            'telefone',
            'dataNasc',
            'complemento'
        ], true)
    }

}