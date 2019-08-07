const Controller = require("./Controller")
const ProdutosDAO = require("../DAOs/ProdutosDAO")

module.exports = class ProdutosController extends Controller {
    constructor() {
        super(`produtos`, `produto`, [ 'nome',
        'categoria',
        'precoUnidade',
        'fornecedor',
        'dataAlteracao',
        'dataCriacao',
        'descricao',
        'garantia',
        'dataFabric',
        'dataValidade' ], true, new ProdutosDAO())
    }

}