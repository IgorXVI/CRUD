const DAO = require("./DAO")

module.exports = class CidadesDAO extends DAO{
    constructor(connection) {
        super(connection)
    }

    adiciona(cidade){
        return super.adiciona(cidade, `cidades`, `nome, UF, CEP, dataAlteracao, dataCriacao`)
    }

    buscaIdPeloNome(nome){
        

        const sql = `SELECT id FROM cidades WHERE nome = ?`
        
        return new Promise((resolve, reject)=>{
            this._connection.get(sql, [nome], (erro, resultado)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve(resultado)
            })
        })
    }

    buscaTodos(){
        const sql = `SELECT * FROM cidades`

        return new Promise((resolve, reject)=>{
            this._connection.all(sql, (erro, todos)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve(todos)
            })
        })
    }
}