let jwt = require('jsonwebtoken')
const secret = require('./secret')

function podePassar(req) {
  return (`${req.baseUrl}${req.url}` == "/api/usuarios/usuario/login" || `${req.baseUrl}${req.url}` == "/api/usuarios/usuario/signup")
}

function checkToken(req, res, next) {
  if (!podePassar(req)) {
    let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
      }

      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          res.status(401).json({
            success: false,
            message: 'Token não é válido.'
          })
          return
        } else {
          req.decoded = decoded
          next()
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Token de autorização não foi informado no header.'
      })
      return
    }
  }
  else{
    next()
  }
}

function checkNivel(nivel, metodos) {

  return (req, res, next) => {
    const usuarioNaoPermitido = req.decoded.nivelAcesso > nivel
    const metodoNaoPermitido = req.decoded.nivelAcesso == nivel && !(metodos.includes(req.method))
    if (usuarioNaoPermitido || metodoNaoPermitido) {
      res.status(401).json({
        success: false,
        erro: "Acesso negado."
      })
      return
    }

    next()
  }

}

module.exports = {
  checkToken,
  checkNivel
}