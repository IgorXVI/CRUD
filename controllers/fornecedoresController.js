const Controller = require("./Controller")

module.exports = class FornecedoresController extends Controller{
    constructor(){
        super(`fornecedores`, `fornecedor`, `CNPJ, nome, email, cidade, dataAlteracao, 
        dataCriacao, telefone, bairro, rua, numeroCasa, complemento`, true)

        this.masterDAO = this.fornecedoresDAO
    }
}