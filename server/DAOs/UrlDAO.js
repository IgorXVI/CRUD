const DAO = require("./DAO")

module.exports = class UsuariosDAO extends DAO {
    constructor() {
        super(`url`)
    }

    async adiciona(objeto) {
        return super.adiciona(objeto, `tabela, urlString`)
    }

    async atualizaPorTabela(url, tabela){
        return super.atualizaUmaColunaPorOutraColuna(url, `urlString`, tabela, `tabela`)
    }

    async buscaPorTabela(tabela) {
        return super.buscaPorColuna(tabela, `tabela`)
    }

}