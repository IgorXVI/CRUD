const HttpService = require("./HttpService")

module.exports = class LoginService {

    constructor() {
        this.http = new HttpService()
    }

    fazerLogin(email, senha) {
        const objeto = {
            email,
            senha,
            tokenEmJSON: false
        }

        return new Promise((resolve, reject) => {
            this.http.post("usuarios/usuario/login", objeto)
                .then(
                    () => {
                        resolve()
                    },
                    (response) => {
                        reject(response.erro)
                    }
                )
                .catch(
                    (erro) => {
                        console.log(erro)
                        reject("Não foi possível realizar login.")
                    }
                )
        })
    }

    fazerSignup(email, senha, nome){
        const objeto = {
            email,
            senha,
            nome
        }

        return new Promise((resolve, reject) => {
            this.http.post("usuarios/usuario/signup", objeto)
                .then(
                    () => {
                        resolve()
                    },
                    (response) => {
                        reject(response.erro)
                    }
                )
                .catch(
                    (erro) => {
                        console.log(erro)
                        reject("Não foi possível realizar signup.")
                    }
                )
        })

    }

}