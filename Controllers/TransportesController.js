const Transportes = require("../Models/Transportes")
const Controller = require("./Controller")

module.exports = class TransportesController extends Controller {
    constructor(){
        super(Transportes)
    }
}