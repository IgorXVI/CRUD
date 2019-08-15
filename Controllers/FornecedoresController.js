const Fornecedores = require("../Models/Fornecedores")
const Controller = require("./Controller")

module.exports = class FornecedoresController extends Controller {
    constructor(){
        super(Fornecedores)
    }
}

