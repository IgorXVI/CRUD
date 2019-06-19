module.exports = class CidadesDAO {
    constructor(connection) {
        this._connection = connection
    }

    adiciona(cidade){
        const valoresCidade = Object.values(cidade)
        const placeholders = valoresCidade.map((valor) => '?').join(',')
        const sql = `INSERT INTO cidades (nome, UF, CEP, dataAlteracao, dataCriacao) VALUES (${placeholders})`

        return new Promise((resolve, reject)=>{
            this._connection.run(sql, valoresCidade, (erro)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    buscaIdPeloNome(nome){
        const sql = `SELECT id FROM cidades WHERE nome = ?`
        
        return new Promise((resolve, reject)=>{
            this._connection.get(sql, [nome], (erro, resultado)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve(resultado.id)
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