const Clientes = require("../Models/Clientes")
const Controller = require("./Controller")

module.exports = class ClientesController extends Controller {
    constructor(){
        super(Clientes)
    }
}