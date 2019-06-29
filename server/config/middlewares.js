let jwt = require('jsonwebtoken')
const secret = require('./secret')

function podePassar(req) {
  return (`${req.baseUrl}${req.url}` == "/api/usuarios/usuario/login" || `${req.baseUrl}${req.url}` == "/api/usuarios/usuario/signup")
}

function checkToken(req, res, next) {
  if (!podePassar(req)) {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.cookies.auth // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
      }

      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          const erro = [{
            msg: "Token não é válido."
          }]
          res.status(401).json({
            erro
          })
          return
        } else {
          req.decoded = decoded
          next()
        }
      });
    } else {
      const erro = [{
        msg: "Token de autorização não foi informado no header."
      }]
      res.status(401).json({
        erro
      })
      return
    }
  } else {
    next()
  }
}

function checkNivel(nivel, metodos) {

  return (req, res, next) => {
    if (!podePassar(req)) {
      const usuarioNaoPermitido = req.decoded.nivelAcesso > nivel
      const metodoNaoPermitido = req.decoded.nivelAcesso == nivel && !(metodos && metodos.includes(req.method))
      if (usuarioNaoPermitido || metodoNaoPermitido) {
        const erro = [{
          msg: "Acesso negado."
        }]
        res.status(401).json({
          erro
        })
      } else {
        next()
      }
    } else {
      next()
    }

  }

}

module.exports = {
  checkToken,
  checkNivel
}