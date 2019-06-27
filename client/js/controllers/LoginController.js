class LoginController {

    constructor() {
        let $ = document.querySelector.bind(document)

        this.inputEmail = $("#inputEmail")
        this.inputSenha = $("#inputSenha")

        this.mensagem = new Bind(
            new Mensagem(), new MensagemView($('#msgView')), 'texto');
    }

    entrar(event) {
        event.preventDefault();

        const dadosLogin = {
            email: this.inputEmail.value,
            senha: this.inputSenha.value,
            tokenEmJSON: false
        }

        // this.limpaFormulario()

        const service = new ApiService()
        service.post("/usuarios/usuario/login", dadosLogin)
            .then(
                () => {
                    this.mensagem.texto = "Login realizado com sucesso."
                },
                (erros)=>{
                    console.log(erros)
                }
            )
            .catch(
                (erro)=>{
                    console.log(erro)
                }
            )
    }

    limpaFormulario() {
        this.inputEmail.value = ""
        this.inputSenha.value = ""
        this.inputEmail.focus();
    }
}