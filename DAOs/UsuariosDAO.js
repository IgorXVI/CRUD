const DAO = require("./DAO")

module.exports = class UsuariosDAO extends DAO {
    constructor() {
        super(`usuarios`)
    }

    async adiciona(usuario) {
        return super.adiciona(usuario, `nome, email, senha, nivelAcesso`)
    }

    async atualizaPorID(usuario, id){
        return super.atualizaPorColuna(usuario, id, `id`, `nome, email, senha, nivelAcesso`)
    }

    async deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    async buscaPorEmail(email) {
        return super.buscaPorColuna(email, `email`)
    }

    async buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

}