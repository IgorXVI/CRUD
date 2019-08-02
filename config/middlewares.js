let jwt = require('jsonwebtoken')

function podePassar(req) {
  const url = `${req.baseUrl}${req.url}`
  return (url === "/api/usuarios/usuario/login" || url === "/api/usuarios/usuario/signup" || url === "/api/usuarios/usuario/logout")
}

function checkToken(req, res, next) {
  if (!podePassar(req)) {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.cookies.auth // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
      }

      jwt.verify(token, process.env.SECRET, (err, decoded) => {
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