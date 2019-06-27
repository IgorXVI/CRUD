class Controller {

    constructor() {
        let $ = document.querySelector.bind(document)
        this.msgView = $("#msgView")
    }

    mostrarMsgErros(erros) {
        this.msgView.innerHTML = ""

        for(let i = 0; i < erros.length; i++){
            let li = document.createElement("li");
            li.textContent = erros[i];
            li.className = "alert alert-danger"
            this.msgView.appendChild(li);
        }
    }

    mostrarMsgAcertos(acertos) {
        this.msgView.innerHTML = ""

        for(let i = 0; i < acertos.length; i++){
            let li = document.createElement("li");
            li.textContent = acertos[i];
            li.className = "alert alert-info"
            this.msgView.appendChild(li);
        }
    }
    
}