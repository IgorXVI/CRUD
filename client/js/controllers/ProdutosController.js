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
        this.eventosOrdenaTabela()
        this.campoFiltro = $("#filtrar-tabela")
        this.campoFiltro.oninput = event => this.filtraCampo(event)
    }

    filtraCampo(event) {
        let registros = document.querySelectorAll(".trDados")
        if (event.target.value.length > 0) {
            for (let j = 0; j < registros.length; j++) {
                let registro = registros[j]
                var tds = registro.querySelectorAll(".tdDados")
                for (let i = 0; i < tds.length; i++) {
                    let txt = tds[i].textContent
                    let expressao = new RegExp(event.target.value, "i");
                    if (!expressao.test(txt)) {
                        registro.classList.add("invisivel");
                    } else {
                        registro.classList.remove("invisivel");
                        break
                    }
                }
            }
        } else {
            registros.forEach(registro => {
                registro.classList.remove("invisivel");
            });
        }

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
        this.tabela.prepend(tr)

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
        tr.className = "trDados"

        tr.appendChild(this.montaBotoes(objeto.id))

        return tr
    }

    montaTd(dado, id, nomeDado) {
        let td = document.createElement("td")
        td.textContent = dado
        td.contentEditable = true
        td.id = `${nomeDado}${id}`
        td.className = "tdDados"
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
        btnCadastra.className = "btn btn-success btn-sm container"
        btnCadastra.type = "button"
        btnCadastra.id = `btnCadastra`
        btnCadastra.setAttribute("onclick", "produtosController.adicionaUm(event)")

        let tdBtnCadastra = document.createElement("td")
        tdBtnCadastra.appendChild(btnCadastra)

        tr.appendChild(tdBtnCadastra)

        tr.id = "trCadastro"

        this.tabela.prepend(tr)

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

    eventosOrdenaTabela() {
        const ths = document.querySelectorAll(".nomesColunasTabela")
        for (let i = 0; i < ths.length; i++) {
            ths[i].onclick = event => this.sortTable(i)
        }
    }

    sortTable(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = this.tabela;
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /* Check if the two rows should switch place,
                based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                // Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /* If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again. */
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

}