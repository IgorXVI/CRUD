const mysql = require("mysql");

module.exports = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "adminadmin",
    database: "lojaDoIgor"
}).connect();