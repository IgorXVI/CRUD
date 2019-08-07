const Controller = require("./Controller")
const EstoqueDAO = require("../DAOs/EstoqueDAO")

module.exports = class EstoqueController extends Controller{
    constructor(){
        super(`estoque`, `produto-estocado`, [ 'quantidade', 'produto', 'dataAlteracao', 'dataCriacao' ], true, new EstoqueDAO())
    }
}