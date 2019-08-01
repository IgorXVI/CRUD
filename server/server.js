require('dotenv').config()

// const gerarDadosAleatorios = require("./scriptDadosAleatorios")
// gerarDadosAleatorios(10)

const app = require("./config/custom-express")

const porta = process.env.PORT
app.listen(porta, ()=>{
    console.log(`ouvindo na porta ${porta}`)
})