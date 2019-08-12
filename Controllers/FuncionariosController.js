const Funcionarios = require("../Models/Funcionarios")
const Controller = require("./Controller")

module.exports = class FuncionariosController extends Controller {
    constructor(){
        super(new Funcionarios())
    }
}

