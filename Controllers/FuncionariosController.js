const Controller = require("./Controller")
const FuncionariosDAO = require("../DAOs/FuncionariosDAO")

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
        'complemento' ], true, new FuncionariosDAO())
    }

}