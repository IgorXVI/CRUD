const Controller = require("./Controller")
const FornecedoresDAO = require("../DAOs/FornecedoresDAO")

module.exports = class FornecedoresController extends Controller{
    constructor(){
        super(`fornecedores`, `fornecedor`, [ 'CNPJ',
        'nome',
        'email',
        'cidade',
        'dataAlteracao',
        'dataCriacao',
        'telefone',
        'bairro',
        'rua',
        'numeroCasa',
        'complemento' ], true, new FornecedoresDAO())
    }

}