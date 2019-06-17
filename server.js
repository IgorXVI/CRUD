const app = require("./config/custom-express")

const porta = 6663
app.listen(porta, ()=>{
    console.log(`ouvindo na porta ${porta}`)
})