const Controller = require("./Controller")

module.exports = class VendasController extends Controller {
    constructor() {
        super(`vendas`, `venda`, ['valorTotal',
            'idFuncionario',
            'idCliente',
            'dataAlteracao',
            'dataCriacao'
        ], false)

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        this.gerarRotaAdicionaUm(super.gerarValidacao(true, ["ValorTotal"]))
        this.gerarRotaAtualizaUm(super.gerarValidacao(false))
        super.gerarRotaDeletaUm()
    }

    gerarRotaAdicionaUm(validacao) {
        this.router.post(`/${this.nomeSingular}`, validacao, (req, res) => {
            (async () => {
                try {
                    super.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                    let objeto = super.gerarObjeto(req)
                    objeto.valorTotal = 0
                    this.adicionaUm(req, res, objeto)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAtualizaUm(validacao) {
        this.router.post(`/${this.nomeSingular}/:id`, validacao, (req, res) => {
            (async () => {
                try {
                    super.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                    let objeto = super.gerarObjeto(req)
                    objeto.valorTotal = 0
                    this.atualizaUm(req, res, objeto)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

}