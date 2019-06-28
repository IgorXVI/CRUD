class ProdutosController extends Controller {

    constructor() {
        super()
        let $ = document.querySelector.bind(document)
        this.tabela = $("#tabela")
        this.atributos = ["id", "nome", "categoria", "precoUnidade", "idFornecedor", "descricao", "garantia", "dataFabric", "dataValidade", "dataCriacao", "dataAlteracao"]
        this.btnSair = $("#btnSair")
        this.btnSair.onclick = event => this.sair(event)
        this.btnBuscaTodos = $("#btnBuscaTodos")
        this.btnBuscaTodos.onclick = event => this.buscarTodos(event)
        this.adicionarTrInput()
    }

    buscarTodos(event) {
        event.preventDefault()

        const service = new ApiService()
        service.get("/produtos")
            .then(
                (resposta) => {
                    this.tabela.innerHTML = ""
                    this.adicionarVariosNaTabela(resposta.resultado)
                    this.adicionarTrInput()
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

        const service = new ApiService()
        service.post(`/produtos/produto/${id}`, objeto)
            .then(
                () => {
                    service.get(`/produtos/produto/${id}`)
                        .then(
                            (resposta) => {
                                for (let i = 0; i < this.atributos.length; i++) {
                                    document.querySelector(`#${this.atributos[i]}${id}`).textContent = resposta.resultado[this.atributos[i]]
                                }
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

    adicionaUm(event) {
        event.preventDefault();

        const id = "0"

        let objeto = {}
        for (let i = 0; i < this.atributos.length; i++) {
            objeto[this.atributos[i]] = document.querySelector(`#${this.atributos[i]}${id}`).textContent
        }

        const service = new ApiService()
        service.post(`/produtos/produto`, objeto)
            .then(
                () => {
                    event.target.parentNode.parentNode.remove()

                    service.get(`/produtos`)
                        .then(
                            (resposta) => {
                                const ultimo = resposta.resultado[resposta.resultado.length - 1]
                                this.adicionarNaTabela(ultimo)
                                this.adicionarTrInput()
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

    adicionarVariosNaTabela(objetos) {
        for (let i = 0; i < objetos.length; i++) {
            this.adicionarNaTabela(objetos[i])
        }
    }

    adicionarNaTabela(objeto) {
        const tr = this.montaTr(objeto)
        this.tabela.appendChild(tr)

        document.querySelector(`#id${objeto.id}`).contentEditable = false
        document.querySelector(`#dataCriacao${objeto.id}`).contentEditable = false
        document.querySelector(`#dataAlteracao${objeto.id}`).contentEditable = false
    }

    montaTr(objeto) {
        let tr = document.createElement("tr")

        for (let i = 0; i < this.atributos.length; i++) {
            tr.appendChild(this.montaTd(objeto[this.atributos[i]], objeto.id, this.atributos[i]))
        }

        tr.id = `tr${objeto.id}`

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

    adicionarTrInput() {
        let tr = document.createElement("tr")

        for (let i = 0; i < this.atributos.length; i++) {
            tr.appendChild(this.montaTd("", "0", this.atributos[i]))
        }

        let btnCadastra = document.createElement("button")
        btnCadastra.textContent = "Cadastrar"
        btnCadastra.className = "btn btn-primary btn-sm container"
        btnCadastra.type = "button"
        btnCadastra.id = `btnCadastra`
        btnCadastra.setAttribute("onclick", "produtosController.adicionaUm(event)")

        let tdBtnCadastra = document.createElement("td")
        tdBtnCadastra.appendChild(btnCadastra)

        tr.appendChild(tdBtnCadastra)

        tr.id = "trCadastro"

        this.tabela.appendChild(tr)

        document.querySelector(`#id0`).contentEditable = false
        document.querySelector(`#dataCriacao0`).contentEditable = false
        document.querySelector(`#dataAlteracao0`).contentEditable = false
    }

    sair(event) {
        event.preventDefault()

        const service = new ApiService()
        service.delete("/usuarios/usuario/logout")
            .then(
                () => {
                    location.href = "/"
                },
                (erros) => {
                    this.mostrarMsgErros(erros)
                }
            )
            .catch(
                (erro) => {
                    this.mostrarMsgErros(["Erro ao conectar com a API."])
                    console.log(erro)
                }
            )
    }

}