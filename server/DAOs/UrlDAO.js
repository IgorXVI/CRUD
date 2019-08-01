const DAO = require("./DAO")

module.exports = class UsuariosDAO extends DAO {
    constructor() {
        super(`url`)
    }

    async atualizaPorTabela(url, tabela){
        let sql = `INSERT OR IGNORE INTO url (tabela, urlString) VALUES (?, ?);`
        this._connection.run(sql, [tabela, url], (erro)=>{
            if(erro){
                throw new Error(erro)
            }
        })

        sql = `UPDATE url SET urlString = ? WHERE tabela = ?;`
        this._connection.run(sql, [url, tabela], (erro)=>{
            if(erro){
                throw new Error(erro)
            }
        })
    }

    async buscaPorTabela(tabela) {
        return super.buscaPorColuna(tabela, `tabela`)
    }

}