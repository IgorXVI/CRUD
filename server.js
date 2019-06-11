express = require("express")
bodyParser = require("body-parser")
routes = require("./routes/routes")

app = express()
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

routes(app)