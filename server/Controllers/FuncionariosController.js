const Controller = require("./Controller")

module.exports = class FuncionariosController extends Controller{
    constructor(){
        super(`funcionarios`, `funcionario`, [ 'CPF',
        'nome',
        'email',
        'salario',
        'cidade',
        'dataAlteracao',
        'dataCriacao',
        'bairro',
        'rua',
        'numeroCasa',
        'telefone',
        'dataNasc',
        'complemento' ], true)
    }

}