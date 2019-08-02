const DAO = require("./DAO")

module.exports = class UsuariosDAO extends DAO {
    constructor() {
        super(`url`)
    }

    async atualizaPorTabela(url, tabela){
        let sql = `INSERT OR IGNORE INTO url (tabela, urlString) VALUES (?, ?);`
        this.runQuery(sql, [tabela, url])

        sql = `UPDATE url SET urlString = ? WHERE tabela = ?;`
        this.runQuery(sql, [url, tabela])
    }

    async buscaPorTabela(tabela) {
        return super.buscaPorColuna(tabela, `tabela`)
    }

}