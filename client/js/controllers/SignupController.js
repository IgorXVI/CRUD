class SignupController extends Controller {

    constructor() {
        super()
        let $ = document.querySelector.bind(document)
        this.inputEmail = $("#inputEmail")
        this.inputSenha = $("#inputSenha")
        this.inputNome = $("#inputNome")
    }

    registrar(event) {
        event.preventDefault();

        const dadosSignup = {
            email: this.inputEmail.value,
            senha: this.inputSenha.value,
            nome: this.inputNome.value
        }

        console.log(dadosSignup)

        const service = new ApiService()
        service.post("/usuarios/usuario/signup", dadosSignup)
            .then(
                () => {
                    super.mostrarMsgAcertos(["Registro realizado com sucesso."])
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

    entrar(event){
        event.preventDefault();
        location.href = "/"
    }
}