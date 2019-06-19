function dataDeHoje() {
    return new Date().toISOString()
}

function fim() {
    console.log("fim")
}

module.exports = {
    dataDeHoje,
    fim
}