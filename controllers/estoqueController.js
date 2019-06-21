const c = require("./controllerFunctions")

const router = c.express.Router()

function formato(req) {
    return cidade = {
        quantidade: req.body.quantidade,
        idProduto: undefined,
        dataAlteracao: c.dataDeHoje(),
        dataCriacao: c.dataDeHoje()
    }
}

function validacao(notNULL) {
    return [
        c.validaQuantidade(notNULL),
        c.validaProduto(notNULL)
    ]
}

module.exports = router