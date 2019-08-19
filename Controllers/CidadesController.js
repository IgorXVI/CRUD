const Cidades = require("../Models/Cidades")
const Controller = require("./Controller")

module.exports = class CidadesController extends Controller {
    constructor(){
        super(new Cidades())
    }
}