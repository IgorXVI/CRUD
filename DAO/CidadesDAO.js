module.exports = class CidadesDAO {
    constructor(connection) {
        this._connection = connection
    }

    buscaIdPeloNome(nome){
        const sql = `SELECT id FROM cidades WHERE nome = ?`
        
        return new Promise((resolve, reject)=>{
            this._connection.get(sql, [nome], (erro, id)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve(id)
            })
        })
    }

    buscaTodosNomes(){
        const sql = `SELECT nome FROM cidades`

        return new Promise((resolve, reject)=>{
            this._connection.all(sql, (erro, nomes)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve(nomes)
            })
        })
    }
}