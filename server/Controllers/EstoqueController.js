const Controller = require("./Controller")

module.exports = class EstoqueController extends Controller{
    constructor(){
        super(`estoque`, `produto-estocado`, [ 'quantidade', 'produto', 'dataAlteracao', 'dataCriacao' ], true)
    }
}