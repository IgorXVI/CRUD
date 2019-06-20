const g = require("./globalFunctions")

const router = g.express.Router()

router.get("/", (req, res)=>{
    console.log("buscando todas as cidades...")
    const cidadesDAO = new g.CidadesDAO(g.dbConnection)
    cidadesDAO.buscaTodos()
        .then(
            (cidades) => {
                res.status(200).json({
                    success: true,
                    cidades
                })
                g.fim()
                return
            }
        )
        .catch(
            (erro) => {
                console.log(erro)
                res.status(500).json({
                    success: false,
                    erro: "Erro no servidor."
                })
                g.fim()
                return
            }
        )
})

router.post("/cidade", [
    g.validaNome(1),
    g.validaUF(1),
    g.validaCEP(1)
], (req, res) => {
    console.log("cadastrando cidade...")

    const errosValidacao = req.validationErrors()
    if (errosValidacao) {
        res.status(400).json({
            success: false,
            errosValidacao
        })
        g.fim()
        return
    }

    const cidade = {
        nome: req.body.nome,
        UF: req.body.UF,
        CEP: req.body.CEP,
        dataAlteracao: g.dataDeHoje(),
        dataCriacao: g.dataDeHoje()
    }

    const cidadesDAO = new g.CidadesDAO(g.dbConnection)
    cidadesDAO.adiciona(cidade)
        .then(
            () => {
                res.status(201).json({
                    success: true,
                    cidade
                })
                g.fim()
                return
            }
        )
        .catch(
            (erro) => {
                console.log(erro)
                res.status(500).json({
                    success: false,
                    erro: "Erro no servidor."
                })
                g.fim()
                return
            }
        )

})

module.exports = router