const Controller = require("./Controller")

module.exports = class CidadesController extends Controller {
    constructor(){
        super(`cidades`, `cidade`, `nome, UF, CEP, dataAlteracao, dataCriacao`, true)

        this.masterDAO = this.cidadesDAO
    }
}