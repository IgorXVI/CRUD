class ApiService {

    constructor(){
        this.host = `/api`
    }

    get(url) {

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest()
            xhr.open("GET", `${this.host}${url}`, true)
            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        resolve(JSON.parse(xhr.responseText))
                    } else {
                        reject(this.tratarErrosDaAPI(JSON.parse(xhr.responseText)))
                    }
                }
            }
            xhr.send()

        })

    }

    post(url, dado) {

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest()
            xhr.open("POST", `${this.host}${url}`, true)
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 201) {
                        resolve()
                    } else {
                        reject(this.tratarErrosDaAPI(JSON.parse(xhr.responseText)))
                    }
                }
            };
            xhr.send(JSON.stringify(dado))

        });

    }

    delete(url){

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest()
            xhr.open("DELETE", `${this.host}${url}`, true)
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 202) {
                        resolve()
                    } else {
                        reject(this.tratarErrosDaAPI(JSON.parse(xhr.responseText)))
                    }
                }
            };
            xhr.send()

        });

    }

    tratarErrosDaAPI(resposta) {
        let erros = resposta.erro
        let resultado = erros.map(erro => {
            let msg = ``
            if (erro.param) {
                msg = `${erro.param}: ${erro.msg}`
            } else {
                msg = erro.msg
            }
            return msg
        })
        return resultado
    }

}
