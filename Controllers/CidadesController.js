const Controller = require("./Controller")
const CidadesDAO = require("../DAOs/CidadesDAO")

module.exports = class CidadesController extends Controller {
    constructor() {
        super(`cidades`, `cidade`, [`nome`, `UF`, `CEP`, `dataAlteracao`, `dataCriacao`], true, new CidadesDAO())
    }
}