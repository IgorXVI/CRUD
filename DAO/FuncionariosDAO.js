module.exports = class FuncionariosDAO {
    constructor(connection){
        this._connection = connection
    }

    add(funcionario){
        return new Promise((resolve, reject)=>{
            this._connection.query("INSERT INTO funcionarios SET ?", )
        })
    }
}
