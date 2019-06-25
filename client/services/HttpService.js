module.exports = class HttpService {

    constructor(){
        this.host = `http://127.0.0.1:6663/`
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
                        reject(JSON.parse(xhr.responseText))
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
                        reject(JSON.parse(xhr.responseText))
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
                        reject(JSON.parse(xhr.responseText))
                    }
                }
            };
            xhr.send()

        });

    }

}