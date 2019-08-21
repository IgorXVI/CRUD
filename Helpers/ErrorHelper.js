module.exports = class ErrorHelper {
    async formatError(attr, value, msg, location){
        let erroFormatado = {
            msg,
            attr,
            value,
            location
        }
        return erroFormatado
    }
}