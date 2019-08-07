const bcrypt = require("bcrypt")
const axios = require("axios")
require('dotenv').config()

const _ = require('lodash');

gerarDadosAleatorios(500)

async function gerarDadosAleatorios(quantidade) {
    const hash = await bcrypt.hash("perestroika", 10)
    const usuarioMaster = {
        nome: "Igor Almeida",
        email: "inazumaseleven04@gmail.com",
        senha: hash,
        nivelAcesso: 0,
        dataAlteracao: dataDeHoje(),
        dataCriacao: dataDeHoje()
    }

    for (let i = 0; i < quantidade; i++) {
        console.log("usuario master: ")
        post("usuarios/usuario", usuarioMaster)
        console.log(`\n\nIteracao: ${i}`)
        console.log("cidades:\n")
        post("cidades/cidade", gerarJSONCidades())
        console.log("clientes:\n")
        post("clientes/cliente", gerarJSONClientes())
        console.log("funcionarios:\n")
        post("funcionarios/funcionario", gerarJSONFuncionarios())
        console.log("fornecedores:\n")
        post("fornecedores/fornecedor", gerarJSONFornecedores())
        console.log("produtos:\n")
        post("produtos/produto", gerarJSONProdutos())
        console.log("estoque:\n")
        post("estoque/produto-estocado", gerarJSONEstoque())
    }
}

async function post(url, dado) {
    try {
        await axios.post(`http://192.168.1.118:${process.env.PORT}/api/${url}`, dado)
    } catch (erro) {
        if (erro.response) {
            console.log(erro.response.data)
        } else if (erro.request) {
            console.log(erro.request)
        } else {
            console.log(erro)
        }
    }
}

function gerarStringAleatoria(tamanho, fixo) {
    let resultado = ""
    let set = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    let N = Math.floor(Math.random() * tamanho) + 1
    if (fixo) {
        N = tamanho
    }

    for (let i = 0; i < N; i++) {
        let numero = Math.floor(Math.random() * set.length)
        resultado += set.charAt(numero)
    }
    return resultado
}

function gerarStringDeNumerosAleatoria(tamanho, minimo, maximo) {
    let resultado = ""
    if(!minimo){
        minimo = 0
    }
    if(!maximo){
        maximo = 10
    }
    for (let i = 0; i < tamanho; i++) {
        let numero = Math.floor(Math.random() * maximo) + minimo
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
    objeto.UF = _.upperCase(gerarStringAleatoria(2, true)).replace(/\s/g, "")
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
    objeto.cidade = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2, 1, 9)}) 9${gerarStringDeNumerosAleatoria(1, 1, 9)}${gerarStringDeNumerosAleatoria(3, 0, 9)}-${gerarStringDeNumerosAleatoria(4, 0, 9)}`
    objeto.dataNasc = dataDeHoje().substring(0, 10)
    objeto.complemento = gerarStringAleatoria(50)
    return objeto
}

function gerarJSONFuncionarios() {
    let objeto = {}
    objeto.CPF = `${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}-${gerarStringDeNumerosAleatoria(2)}`
    objeto.nome = gerarStringAleatoria(10)
    objeto.email = `${gerarStringAleatoria(10)}@${gerarStringAleatoria(5)}.com`
    objeto.salario = (Math.random() * (10000000000000 - 900) + 900)
    objeto.cidade = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2, 1, 9)}) 9${gerarStringDeNumerosAleatoria(1, 1, 9)}${gerarStringDeNumerosAleatoria(3, 0, 9)}-${gerarStringDeNumerosAleatoria(4, 0, 9)}`
    objeto.dataNasc = dataDeHoje().substring(0, 10)
    objeto.complemento = gerarStringAleatoria(50)
    return objeto
}

function gerarJSONFornecedores() {
    let objeto = {}
    objeto.CNPJ = `${gerarStringDeNumerosAleatoria(2)}.${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}/${gerarStringDeNumerosAleatoria(4)}-${gerarStringDeNumerosAleatoria(2)}`
    objeto.nome = gerarStringAleatoria(10)
    objeto.email = `${gerarStringAleatoria(10)}@${gerarStringAleatoria(5)}.com`
    objeto.cidade = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2, 1, 9)}) 9${gerarStringDeNumerosAleatoria(1, 1, 9)}${gerarStringDeNumerosAleatoria(3, 0, 9)}-${gerarStringDeNumerosAleatoria(4, 0, 9)}`
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.complemento = gerarStringAleatoria(50)
    return objeto
}

function gerarJSONProdutos() {
    let objeto = {}
    objeto.nome = gerarStringAleatoria(10)
    objeto.categoria = gerarStringAleatoria(10)
    objeto.precoUnidade = (Math.random() * (10000000 - 1) + 1)
    objeto.fornecedor = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    objeto.descricao = gerarStringAleatoria(50)
    objeto.garantia = Math.floor(Math.random() * 10)
    objeto.dataFabric = dataDeHoje().substring(0, 10)
    objeto.dataValidade = dataDeHoje().substring(0, 10)
    return objeto
}

function gerarJSONEstoque() {
    let objeto = {}
    objeto.quantidade = Math.floor(Math.random() * 100)
    objeto.produto = 1
    objeto.dataAlteracao = dataDeHoje()
    objeto.dataCriacao = dataDeHoje()
    return objeto
}