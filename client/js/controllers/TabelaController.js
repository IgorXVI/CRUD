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

    gerarRelatorio(event) {
        event.preventDefault()

        const acoesHead = document.querySelector("#acoesHead")
        const tdAcoes = document.querySelectorAll(".tdAcoes")

        acoesHead.classList.add("invisivel")
        if (tdAcoes.length > 0) {
            for (let i = 0; i < tdAcoes.length; i++) {
                tdAcoes[i].classList.add("invisivel")
            }
        }

        const todaTabela = document.querySelector(".table-responsive")

        html2canvas(todaTabela).then(canvas => {
            canvas.style.width = "100%"
            const dataUrl = canvas.toDataURL()

            const colunaFiltro = document.querySelector("#select-filtra").value
            const valorColunaFiltro = this.campoFiltro.value
            
            let primeiraParte = `, filtrado pelas colunas ${colunaFiltro}`
            let segundaParte = `que possuem valor semelhante à ${valorColunaFiltro}`

            if(colunaFiltro === "Todos"){
                primeiraParte = `, filtrado por todas as colunas `
            }

            if(valorColunaFiltro === ""){
                primeiraParte = ``
                segundaParte = ``
            }
            
            let tituloRelatorio = `Relatório de ${this.nomePlural}${primeiraParte}${segundaParte}`
        
            let windowContent = '<!DOCTYPE html>';
            windowContent += '<html>'
            windowContent += `<head><title>Relatório de ${this.nomePlural}</title></head>`;
            windowContent += '<body>'
            windowContent += `<h3>${tituloRelatorio}</h3>`
            windowContent += '<img src="' + dataUrl + '">';
            windowContent += '</body>';
            windowContent += '</html>';
            let printWin = window.open('', '', 'width=340,height=260');
            printWin.document.open();
            printWin.document.write(windowContent);
            printWin.document.close();
            printWin.focus();
            printWin.print();
            printWin.close();

        })

        acoesHead.classList.remove("invisivel")
        if (tdAcoes.length > 0) {
            for (let i = 0; i < tdAcoes.length; i++) {
                tdAcoes[i].classList.remove("invisivel")
            }
        }

    }

    criarTabelaHeader() {
        this.campoFiltro.classList.remove("invisivel")
        this.criarColunasTableHeader()
        this.eventosOrdenaTabela()
        document.querySelector("#select-filtra").classList.remove("invisivel")
    }

    filtraCampo(event) {
        let registros = document.querySelectorAll(".trDados")
        let nomeDado = document.querySelector("#select-filtra").value

        if (event.target.value.length > 0) {

            if (nomeDado === "Todos") {

                for (let j = 0; j < registros.length; j++) {
                    let registro = registros[j]

                    for (let i = 0; i < this.atributos.length; i++) {
                        let txt = registro.querySelector(`.tdDados${this.atributos[i]}`).textContent

                        let expressao = new RegExp(event.target.value, "i")
                        if (!expressao.test(txt)) {
                            registro.classList.add("invisivel")
                        } else {
                            registro.classList.remove("invisivel")
                            break
                        }
                    }

                }

            } else {

                for (let j = 0; j < registros.length; j++) {
                    let registro = registros[j]

                    let txt = registro.querySelector(`.tdDados${nomeDado}`).textContent

                    let expressao = new RegExp(event.target.value, "i")
                    if (!expressao.test(txt)) {
                        registro.classList.add("invisivel")
                    } else {
                        registro.classList.remove("invisivel")
                    }

                }

            }

        } else {
            registros.forEach(registro => {
                registro.classList.remove("invisivel")
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
                if (text && text !== "") {
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
                if (text && text !== "") {
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
        btnd.type = "button"
        btnd.className = "btn btn-danger btn-sm btn-acoes"
        btnd.id = `d${id}`
        btnd.onclick = event => this.deletaUm(event)

        let btne = document.createElement("button")
        btne.textContent = "Editar"
        btne.type = "button"
        btne.className = "btn btn-warning btn-sm btn-acoes"
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
                if (input && this.atributos[i] !== "senha") {
                    input.value = document.querySelector(`#${this.atributos[i]}${id}`).textContent
                }
            }

            this.btnEnviar.onclick = event => this.editaUm(event)
        }

        let td = document.createElement("td")
        td.className = "tdAcoes"
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
        let select = document.createElement("select")
        select.className = "form-control invisivel"
        select.id = "select-filtra"

        let trNomesColunas = document.createElement("tr")

        for (let i = 0; i < this.atributos.length + 1; i++) {
            let option = document.createElement("option")

            let thNomesColunas = document.createElement("th")
            thNomesColunas.scope = "col"
            thNomesColunas.className = "nomesColunasTabela"

            if (i < this.atributos.length) {
                option.value = this.atributos[i]
                option.textContent = this.atributos[i]

                thNomesColunas.textContent = this.atributos[i]
                thNomesColunas.id = `${this.atributos[i]}Head`
            } else {
                option.value = "Todos"
                option.textContent = "Todos"
                option.selected = true

                thNomesColunas.textContent = "Ações"
                thNomesColunas.id = "acoesHead"
            }

            select.appendChild(option)
            trNomesColunas.appendChild(thNomesColunas)
        }

        let thead = document.querySelector(".thead-dark")
        thead.appendChild(trNomesColunas)

        let divInputInicio = document.querySelector(".card-body").querySelector("form").querySelector("div")

        let divSelect = document.createElement("div")
        divSelect.className = "col-auto input-inicio"
        divSelect.appendChild(select)

        let f = divInputInicio.querySelector(".input-inicio")
        divInputInicio.insertBefore(divSelect, f)

        let btnGerarRelatorio = document.createElement("button")
        btnGerarRelatorio.type = "button"
        btnGerarRelatorio.className = "btn btn-secondary btn-lg"
        btnGerarRelatorio.id = "btnGerarRelatorio"
        btnGerarRelatorio.textContent = "Gerar Relatorio"
        btnGerarRelatorio.onclick = event => this.gerarRelatorio(event)

        let divBtnGerarRelatorio = document.createElement("div")
        divBtnGerarRelatorio.className = "col-auto btn-inicio"
        divBtnGerarRelatorio.appendChild(btnGerarRelatorio)

        let s = divInputInicio.querySelector(".input-inicio")
        divInputInicio.insertBefore(divBtnGerarRelatorio, s)
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
                y = rows[(i + 1) % rows.length].getElementsByTagName("TD")[n];

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
                rows[i].parentNode.insertBefore(rows[(i + 1) % rows.length], rows[i]);
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