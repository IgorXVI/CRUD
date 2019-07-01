class VendasController extends TabelaController {

    constructor() {
        super(["id", "valorTotal", "idFuncionario", "idCliente", "dataAlteracao", "dataCriacao"], "venda", "vendas", true)

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
    }

}