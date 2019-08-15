const Armazens = require("../Models/Armazens")
const Controller = require("./Controller")

module.exports = class ArmazensController extends Controller {
    constructor(){
        super(Armazens)
    }
}