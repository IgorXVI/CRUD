module.exports = class CidadesDAO {
    constructor(connection) {
        this._connection = connection
    }

    getID(name) {
        return new Promise((resolve, reject) => {
            this._connection.query("SELECT id FROM cidades WHERE name=?",
                [name],
                (error, results) => {
                    if (error) {
                        reject(new Error(error))
                        return
                    }

                    resolve(results)
                })
        })
    }
}