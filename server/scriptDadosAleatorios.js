const CidadesDAO = require("./DAOs/CidadesDAO")
const FuncionariosDAO = require("./DAOs/FuncionariosDAO")
const ClientesDAO = require("./DAOs/ClientesDAO")
const FornecedoresDAO = require("./DAOs/FornecedoresDAO")
const ProdutosDAO = require("./DAOs/ProdutosDAO")
const EstoqueDAO = require("./DAOs/EstoqueDAO")
const UsuariosDAO = require("./DAOs/UsuariosDAO")

const _ = require('lodash');

async function gerarDadosAleatorios(quantidade) {
    const cidadesDAO = new CidadesDAO()
    const clientesDAO = new ClientesDAO()
    const funcionariosDAO = new FuncionariosDAO()
    const fornecedoresDAO = new FornecedoresDAO()
    const produtosDAO = new ProdutosDAO()
    const estoqueDAO = new EstoqueDAO()
    const usuariosDAO = new UsuariosDAO()

    const usuarioMaster = {
        usuario: "Igor Almeida",
        email: "inazumaseleven04@gmail.com",
        senha: "perestroika",
        nivelAcesso: 0,
        dataAlteracao: dataDeHoje(),
        dataCriacao: dataDeHoje()
    }

    for (let i = 0; i < quantidade; i++) {
        await cidadesDAO.adiciona(gerarJSONCidades())
        await clientesDAO.adiciona(gerarJSONClientes())
        await funcionariosDAO.adiciona(gerarJSONFuncionarios())
        await fornecedoresDAO.adiciona(gerarJSONFornecedores())
        await produtosDAO.adiciona(gerarJSONProdutos())
        await estoqueDAO.adiciona(gerarJSONEstoque())
        await usuariosDAO.adiciona(usuarioMaster)
    }
}

function gerarStringAleatoria(tamanho) {
    const N = Math.floor(Math.random() * tamanho) + 1
    return Array(N + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, N)
}

function gerarStringDeNumerosAleatoria(tamanho) {
    let resultado = ""
    for (let i = 0; i < tamanho; i++) {
        let numero = Math.floor(Math.random() * 10)
        resultado += numero
    }
    return resultado
}

function dataDeHoje() {
    return new Date().toISOString()
}

function gerarJSONCidades() {
    let objeto = {}
    objeto.nome = gerarStringAleatoria(29)
    objeto.UF = _.upperCase(gerarStringAleatoria(2))
    objeto.CEP = `${gerarStringDeNumerosAleatoria(5)}-${gerarStringDeNumerosAleatoria(3)}`
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    return objeto
}

function gerarJSONClientes() {
    let objeto = {}
    objeto.CPF = `${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}-${gerarStringDeNumerosAleatoria(2)}`
    objeto.nome = gerarStringAleatoria(10)
    objeto.email = `${gerarStringAleatoria(10)}@${gerarStringAleatoria(5)}.com`
    objeto.idCidade = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2)}) ${gerarStringDeNumerosAleatoria(5)}-${gerarStringDeNumerosAleatoria(4)}`
    objeto.dataNasc = dataDeHoje().substring(0, 9)
    objeto.complemento = gerarStringAleatoria(50)
    return objeto
}

function gerarJSONFuncionarios() {
    let objeto = {}
    objeto.CPF = `${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}-${gerarStringDeNumerosAleatoria(2)}`
    objeto.nome = gerarStringAleatoria(10)
    objeto.email = `${gerarStringAleatoria(10)}@${gerarStringAleatoria(5)}.com`
    objeto.salario = Math.random()
    objeto.idCidade = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2)}) ${gerarStringDeNumerosAleatoria(5)}-${gerarStringDeNumerosAleatoria(4)}`
    objeto.dataNasc = dataDeHoje().substring(0, 9)
    objeto.complemento =  gerarStringAleatoria(50)
    return objeto
}

function gerarJSONFornecedores(){
    let objeto = {}
    objeto.CNPJ = `${gerarStringDeNumerosAleatoria(2)}.${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}/${gerarStringDeNumerosAleatoria(4)}-${gerarStringDeNumerosAleatoria(2)}`
    objeto.nome = gerarStringAleatoria(10)
    objeto.email = `${gerarStringAleatoria(10)}@${gerarStringAleatoria(5)}.com`
    objeto.idCidade = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2)}) ${gerarStringDeNumerosAleatoria(5)}-${gerarStringDeNumerosAleatoria(4)}`
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.complemento =  gerarStringAleatoria(50)
    return objeto
}

function gerarJSONProdutos(){
    let objeto = {}
    objeto.nome = gerarStringAleatoria(10)
    objeto.categoria = gerarStringAleatoria(10)
    objeto.precoUnidade = Math.random()
    objeto.idFornecedor = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    objeto.descricao = gerarStringAleatoria(50)
    objeto.garantia = Math.floor(Math.random() * 10)
    objeto.dataFabric = dataDeHoje().substring(0, 9)
    objeto.dataValidade = dataDeHoje().substring(0, 9)
    return objeto
}

function gerarJSONEstoque(){
    let objeto = {}
    objeto.quantidade = Math.floor(Math.random() * 100)
    objeto.idProduto = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    return objeto
}

module.exports = gerarDadosAleatorios