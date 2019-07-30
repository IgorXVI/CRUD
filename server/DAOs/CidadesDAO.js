const DAO = require("./DAO")

module.exports = class CidadesDAO extends DAO{
    constructor() {
        super(`cidades`)
    }

    async adiciona(cidade) {
        return super.adiciona(cidade, `nome, UF, CEP, dataAlteracao, dataCriacao`)
    }

    async atualizaPorID(cidade, id){
        return super.atualizaPorColuna(cidade, id, `id`, `nome, UF, CEP, dataAlteracao`)
    }

    async deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    async buscaPorNome(nome) {
        return super.buscaPorColuna(nome, `nome`)
    }

    async buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }
}