const DAO = require("./DAO")

module.exports = class UsuariosDAO extends DAO {
    constructor() {
        super(`url`)
    }

    async atualizaPorTabela(url, tabela, data) {
        let sql = `INSERT OR IGNORE INTO url (tabela, urlString, dataAlteracao, dataCriacao) VALUES (?, ?, ?, ?);`
        this.runQuery(sql, [tabela, url, data, data])

        sql = `UPDATE url SET urlString = ?, dataAlteracao = ? WHERE tabela = ?;`
        this.runQuery(sql, [url, data, tabela])
    }

    async buscaPorTabela(tabela) {
        return super.buscaPorColuna(tabela, `tabela`)
    }

}