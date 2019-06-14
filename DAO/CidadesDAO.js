module.exports = class CidadesDAO {
    constructor(connection) {
        this._connection = connection
    }

    busca(nome) {
        return new Promise((resolve, reject) => {
            this._connection.query("SELECT * FROM cidades WHERE nome=?",
                [nome],
                (erro, cidade) => {
                    if (erro) {
                        reject(new Error(erro))
                        return
                    }

                    resolve(cidade)
                })
        })
    }
}