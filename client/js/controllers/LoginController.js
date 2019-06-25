class LoginController extends Controller {

    constructor() {
        super()
        let $ = document.querySelector.bind(document)
        this.inputEmail = $("#inputEmail")
        this.inputSenha = $("#inputSenha")
    }

    entrar(event) {
        event.preventDefault();

        const dadosLogin = {
            email: this.inputEmail.value,
            senha: this.inputSenha.value,
            tokenEmJSON: false
        }

        const service = new ApiService()
        service.post("/usuarios/usuario/login", dadosLogin)
            .then(
                () => {
                    location.href = "/produtos"
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

    registrar(event){
        event.preventDefault();
        location.href = "/signup"
    }
}