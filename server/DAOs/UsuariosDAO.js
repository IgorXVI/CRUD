const DAO = require("./DAO")

module.exports = class UsuariosDAO extends DAO {
    constructor(connection) {
        super(connection, `usuarios`)
    }

    adiciona(usuario) {
        return super.adiciona(usuario, `nome, email, senha, nivelAcesso, dataAlteracao, dataCriacao`)
    }

    atualizaPorID(usuario, id){
        return super.atualizaPorColuna(usuario, id, `id`, `nome, email, senha, nivelAcesso, dataAlteracao`)
    }

    deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    buscaPorEmail(email) {
        return super.buscaPorColuna(email, `email`)
    }

    buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

}