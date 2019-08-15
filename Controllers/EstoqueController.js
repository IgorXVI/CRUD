const Estoque = require("../Models/Estoque")
const Controller = require("./Controller")

module.exports = class EstoqueController extends Controller {
    constructor(){
        super(Estoque)
    }
}