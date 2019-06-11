const dbConnection = require("../db")
const CidadesDAO = require("../DAO/CidadesDAO")
const bcrypt = require("bcrypt")

module.exports = (app) => {
    app.post("/registro/cliente", (req, res) => {

        const cidadesDAO = new CidadesDAO(dbConnection)
        const cidadeID = cidadesDAO.getID(req.body.cidade)

        const hashSenha = await new Promise((resolve, reject) => {
            bcrypt.hash(req.body.senha, 10, (err, hash) => {
                if (err) {
                    console.log(err)
                    reject()
                    return
                }
                resolve(hash)
            });
        })

        if(!hashSenha){
            res.status(500).send("Erro no hashing da senha.")
            return
        }

        const cliente = {
            cpf: req.body.cpf,
            nome: req.body.nome,
            email: req.body.email,
            senha: hashSenha,
            idCidade: cidadeID,
            
        }   
    })
}