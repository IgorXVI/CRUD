class TabelaController extends Controller {

    constructor(atributos, nomeSingular, nomePlural) {
        super()
        this.nomeSingular = nomeSingular
        this.nomePlural = nomePlural
        this.atributos = atributos

        let $ = document.querySelector.bind(document)
        this.campoFiltro = $("#filtrar-tabela")
        this.tabela = $("#tabela")
        this.btnSair = $("#btnSair")
        this.btnBuscaTodos = $("#btnBuscaTodos")
        this.btnEnviar = $("#btnEnviar")
        this.btnCadastrar = $("#btnCadastrar")

        this.btnCadastrar.onclick = event => {
            document.querySelector("#idRow").classList.add("invisivel")
            this.btnEnviar.onclick = event => this.adicionaUm(event)
        }
        this.btnSair.onclick = event => this.sair(event)
        this.btnBuscaTodos.onclick = event => this.buscarTodos(event)
        this.campoFiltro.oninput = event => this.filtraCampo(event)

        this.criarTabelaHeader()
    }

    criarTabelaHeader() {
        this.campoFiltro.classList.remove("invisivel")
        this.criarColunasTableHeader()
        this.eventosOrdenaTabela()
    }

    filtraCampo(event) {
        let registros = document.querySelectorAll(".trDados")
        let nomeDado = (document.querySelector('input[name="radio"]:checked').id).substr(1)

        if (event.target.value.length > 0) {
            for (let j = 0; j < registros.length; j++) {
                let registro = registros[j]

                let txt = registro.querySelector(`.tdDados${nomeDado}`).textContent

                let expressao = new RegExp(event.target.value, "i");
                if (!expressao.test(txt)) {
                    registro.classList.add("invisivel");
                } else {
                    registro.classList.remove("invisivel");
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
        service.get(`/${this.nomePlural}`)
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
        service.delete(`/${this.nomePlural}/${this.nomeSingular}/${id}`)
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

        let id = document.querySelector("#idInput").value

        let objeto = {}
        for (let i = 1; i < this.atributos.length - 2; i++) {
            let input = document.querySelector(`#${this.atributos[i]}Input`)
            if (input) {
                let text = input.value
                if (text !== "") {
                    objeto[this.atributos[i]] = text
                }
            }
        }

        const service = new ApiService()
        service.post(`/${this.nomePlural}/${this.nomeSingular}/${id}`, objeto)
            .then(
                () => {
                    this.btnBuscaTodos.click()
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

        let objeto = {}
        for (let i = 1; i < this.atributos.length - 2; i++) {
            let input = document.querySelector(`#${this.atributos[i]}Input`)
            if (input) {
                let text = input.value
                if (text !== "") {
                    objeto[this.atributos[i]] = text
                }
            }
        }

        const service = new ApiService()
        service.post(`/${this.nomePlural}/${this.nomeSingular}`, objeto)
            .then(
                () => {
                    this.btnBuscaTodos.click()
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
        td.id = `${nomeDado}${id}`
        td.className = `tdDados${nomeDado}`
        return td
    }

    montaBotoes(id) {
        let btnd = document.createElement("button")
        btnd.textContent = "Deletar"
        btnd.className = "btn btn-danger btn-sm container"
        btnd.type = "button"
        btnd.id = `d${id}`
        btnd.onclick = event => this.deletaUm(event)

        let btne = document.createElement("button")
        btne.textContent = "Editar"
        btne.className = "btn btn-warning btn-sm container"
        btne.type = "button"
        btne.id = `e${id}`
        btne.setAttribute("data-toggle", "modal")
        btne.setAttribute("data-target", "#formularioModal")
        btne.onclick = event => {
            const idInput2 = document.querySelector("#idInput")
            idInput2.value = id
            idInput2.readOnly = true
            idInput2.type = "text"

            document.querySelector("#idRow").classList.remove("invisivel")

            for (let i = 1; i < this.atributos.length - 2; i++) {
                const input = document.querySelector(`#${this.atributos[i]}Input`)
                if(input && this.atributos[i] !== "senha"){
                    input.value = document.querySelector(`#${this.atributos[i]}${id}`).textContent
                }
            }

            this.btnEnviar.onclick = event => this.editaUm(event)
        }

        let td = document.createElement("td")

        td.appendChild(btnd)
        td.appendChild(btne)

        return td
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

    criarColunasTableHeader() {
        let trRadio = document.createElement("tr")
        let trNomesColunas = document.createElement("tr")

        for (let i = 0; i < this.atributos.length + 1; i++) {
            let thRadio = document.createElement("th")
            thRadio.scope = "col"

            let thNomesColunas = document.createElement("th")
            thNomesColunas.scope = "col"
            thNomesColunas.className = "nomesColunasTabela"

            if (i < this.atributos.length) {
                let radioBtn = document.createElement("input")
                radioBtn.type = "radio"
                radioBtn.name = "radio"
                radioBtn.className = "container"
                radioBtn.id = `R${this.atributos[i]}`
                if (this.atributos[i] == "id") {
                    radioBtn.checked = true
                }
                thRadio.appendChild(radioBtn)

                thNomesColunas.textContent = this.atributos[i]
                thNomesColunas.id = `${this.atributos[i]}Head`
            } else {
                thNomesColunas.textContent = "Ações"
                thNomesColunas.id = "acoesHead"
            }

            trRadio.appendChild(thRadio)
            trNomesColunas.appendChild(thNomesColunas)
        }

        let thead = document.querySelector(".thead-dark")
        thead.appendChild(trRadio)
        thead.appendChild(trNomesColunas)
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
            for (i = 0; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[(i + 1)%rows.length].getElementsByTagName("TD")[n];

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
                rows[i].parentNode.insertBefore(rows[(i + 1)%rows.length], rows[i]);
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