module.exports = class FuncionariosDAO {
    constructor(connection){
        this._connection = connection
    }

    adicionar(funcionario){
        const valoresFuncionario = Object.values(funcionario)
        const placeholders = valoresFuncionario.map((valor) => '(?)').join(',')
        const sql = `INSERT INTO funcionarios() SET ${placeholders}`

        return new Promise((resolve, reject)=>{
            this._connection.run(sql, valoresFuncionario,(erro)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    
    }
}
