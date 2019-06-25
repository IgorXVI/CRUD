class ProdutosController extends Controller {

    constructor() {
        super()
        let $ = document.querySelector.bind(document)
        this.tabela = $("#tabela")
    }

    buscarTodos(event) {
        event.preventDefault();

        const service = new ApiService()
        service.get("/produtos")
            .then(
                (resposta) => {
                    this.tabela.innerHTML = ""
                    this.adicionarVariosNaTabela(resposta.resultado)
                },
                (erros) => {
                    super.mostrarMsgErros(erros)
                }
            )
            .catch(
                (erro) => {
                    super.mostrarMsgErros(["Erro ao conectar com a API."])
                    console.log(erro)
                }
            )
    }

    deletaUm(event) {
        event.preventDefault();

        let id = event.target.id
        id = id.substr(1);
        const service = new ApiService()
        service.delete(`/produtos/produto/${id}`)
            .then(
                () => {
                    event.target.parentNode.parentNode.remove()
                },
                (erros) => {
                    super.mostrarMsgErros(erros)
                }
            )
            .catch(
                (erro) => {
                    super.mostrarMsgErros(["Erro ao conectar com a API."])
                    console.log(erro)
                }
            )
    }

    editaUm(event) {
        event.preventDefault();

    }

    adicionarVariosNaTabela(objetos) {
        for (let i = 0; i < objetos.length; i++) {
            this.adicionarNaTabela(objetos[i])
        }
    }

    adicionarNaTabela(objeto) {
        const tr = this.montaTr(objeto)
        this.tabela.appendChild(tr)
    }

    montaTr(objeto) {
        let tr = document.createElement("tr")
        tr.appendChild(this.montaTd(objeto.id))
        tr.appendChild(this.montaTd(objeto.nome))
        tr.appendChild(this.montaTd(objeto.categoria))
        tr.appendChild(this.montaTd(objeto.precoUnidade))
        tr.appendChild(this.montaTd(objeto.idFornecedor))
        tr.appendChild(this.montaTd(objeto.descricao))
        tr.appendChild(this.montaTd(objeto.garantia))
        tr.appendChild(this.montaTd(objeto.dataFabric))
        tr.appendChild(this.montaTd(objeto.dataValidade))
        tr.appendChild(this.montaTd(objeto.dataCriacao))
        tr.appendChild(this.montaTd(objeto.dataAlteracao))
        tr.appendChild(this.montaBotoes(objeto.id))
        return tr
    }

    montaTd(dado) {
        let td = document.createElement("td")
        td.textContent = dado
        return td
    }

    montaBotoes(id) {
        let btnd = document.createElement("button")
        btnd.textContent = "Deletar"
        btnd.className = "btn btn-danger btn-sm container"
        btnd.type = "button"
        btnd.id = `d${id}`
        btnd.setAttribute("onclick", "produtosController.deletaUm(event)")

        let btne = document.createElement("button")
        btne.textContent = "Editar"
        btne.className = "btn btn-warning btn-sm container"
        btne.type = "button"
        btne.id = `e${id}`
        btne.setAttribute("onclick", "produtosController.editaUm(event)")

        let td = document.createElement("td")
        td.appendChild(btnd)

        td.appendChild(btne)
        return td
    }

}