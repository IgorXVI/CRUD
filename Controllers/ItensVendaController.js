const ItensVenda = require("../Models/ItensVenda")
const Controller = require("./Controller")

module.exports = class ItensVendaController extends Controller {
    constructor(){
        super(ItensVenda)
    }
}