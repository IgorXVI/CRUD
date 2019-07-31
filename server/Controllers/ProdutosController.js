const Controller = require("./Controller")

module.exports = class ProdutosController extends Controller {
    constructor() {
        super(`produtos`, `produto`, [ 'nome',
        'categoria',
        'precoUnidade',
        'idFornecedor',
        'dataAlteracao',
        'dataCriacao',
        'descricao',
        'garantia',
        'dataFabric',
        'dataValidade' ], true)
    }

}