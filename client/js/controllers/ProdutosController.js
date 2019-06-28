class ProdutosController extends Controller {

    constructor() {
        super()
        let $ = document.querySelector.bind(document)
        this.tabela = $("#tabela")
        this.atributos = ["id", "nome", "categoria", "precoUnidade", "idFornecedor", "descricao", "garantia", "dataFabric", "dataValidade", "dataCriacao", "dataAlteracao"]
    }

    buscarTodos(event) {
        event.preventDefault()

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
        event.preventDefault()

        let id = event.target.id
        id = id.substr(1)

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

        let id = event.target.id
        id = id.substr(1)

        let objeto = {}
        for (let i = 0; i < this.atributos.length; i++) {
            objeto[this.atributos[i]] = document.querySelector(`#${this.atributos[i]}${id}`).textContent
        }

        console.log(objeto)

        const service = new ApiService()
        service.post(`/produtos/produto/${id}`, objeto)
            .then(
                () => {
                    super.mostrarMsgAcertos(["Editado com sucesso."])                },
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

        for (let i = 0; i < this.atributos.length; i++) {
            tr.appendChild(this.montaTd(objeto[this.atributos[i]], objeto.id, this.atributos[i]))
        }

        tr.appendChild(this.montaBotoes(objeto.id))
        return tr
    }

    montaTd(dado, id, nomeDado) {
        let td = document.createElement("td")
        td.textContent = dado
        td.contentEditable = true
        td.id = `${nomeDado}${id}`
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