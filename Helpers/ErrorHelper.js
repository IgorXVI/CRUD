module.exports = class ErrorHelper {
    async formatError(param, value, msg, location){
        let erroFormatado = {
            msg,
            param,
            value,
            location
        }
        return erroFormatado
    }
}