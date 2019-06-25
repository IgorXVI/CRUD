const DAO = require("./DAO")

module.exports = class CidadesDAO extends DAO{
    constructor(connection) {
        super(connection, `cidades`)
    }

    adiciona(cidade) {
        return super.adiciona(cidade, `nome, UF, CEP, dataAlteracao, dataCriacao`)
    }

    atualizaPorID(cidade, id){
        return super.atualizaPorColuna(cidade, id, `id`, `nome, UF, CEP, dataAlteracao`)
    }

    deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    buscaPorNome(nome) {
        return super.buscaPorColuna(nome, `nome`)
    }

    buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }
}