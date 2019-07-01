class ItensVendaController extends TabelaController {

    constructor() {
        super(["id", "valorTotal", "quantidade", "idProduto", "idVenda", "dataAlteracao", "dataCriacao"], "item", "itens-venda", true)

        super.criarColunasTableHeader()
        this.adicionarTrInput()
        this.eventosOrdenaTabela()
    }

    adicionarTrInput() {
        super.adicionarTrInput()
        
        document.querySelector(`#valorTotal0`).contentEditable = false
    }

    adicionarNaTabela(objeto) {
        super.adicionarNaTabela(objeto)

        document.querySelector(`#valorTotal${objeto.id}`).contentEditable = false
        document.querySelector(`#idProduto${objeto.id}`).contentEditable = false
        document.querySelector(`#idVenda${objeto.id}`).contentEditable = false
    }

}