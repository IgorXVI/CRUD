const bcrypt = require("bcrypt")
const axios = require("axios")
const ip = require("ip")
require('dotenv').config()

const _ = require('lodash');

gerarDadosAleatorios(1)

async function gerarDadosAleatorios(quantidade) {
    for (let i = 0; i < quantidade; i++) {
        console.log(`\n\nIteracao: ${i}`)

        console.log("cidades:")
        await post("cidades/cidade", gerarJSONCidades())
        await post("cidades/cidade", {})
        await post("cidades/cidade", gerarJSONCidadesTA())

        console.log("clientes:")
        await post("clientes/cliente", gerarJSONClientes())
        await post("clientes/cliente", {})
        await post("clientes/cliente", gerarJSONClientesTA())
        
        console.log("funcionarios:")
        await post("funcionarios/funcionario", await gerarJSONFuncionarios())
        await post("funcionarios/funcionario", {})
        await post("funcionarios/funcionario", gerarJSONFuncionariosTA())
        
        console.log("fornecedores:")
        await post("fornecedores/fornecedor", gerarJSONFornecedores())
        await post("fornecedores/fornecedor", {})
        await post("fornecedores/fornecedor", gerarJSONFornecedoresTA())
        
        console.log("produtos:")
        await post("produtos/produto", gerarJSONProdutos())
        await post("produtos/produto", {})
        await post("produtos/produto", gerarJSONProdutosTA())
        
        console.log("estoque:")
        await post("estoque/item-estocado", gerarJSONEstoque())
        await post("estoque/item-estocado", {})
        await post("estoque/item-estocado", gerarJSONEstoqueTA())

        console.log("armazem:")
        await post("armazens/armazem", gerarJSONArmazem())
        await post("armazens/armazem", {})
        await post("armazens/armazem", gerarJSONArmazemTA())
        
        // // console.log("venda: ")
        // // await post(`vendas/venda`, await gerarJSONVenda())
    }
}

async function post(url, dado) {
    try {
        await axios.post(`http://${ip.address()}:${process.env.PORT}/api/${url}`, dado)
        console.log("sem erro")
    } catch (erro) {
        if (erro.response) {
            console.log("erro resposta")
            console.log(erro.response.data)
        } else if (erro.request) {
            console.log("erro request")
            console.log(erro.errno)
        } else {
            console.log("outro erro")
            console.log(erro)
        }
    }
}

function gerarStringAleatoria(tamanho, fixo) {
    let resultado = ""
    let set = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    
    let N = Math.floor(Math.random() * tamanho)
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
    if (!minimo) {
        minimo = 0
    }
    if (!maximo) {
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

async function gerarJSONVenda() {
    let objeto = {}
    objeto.funcionario = 1
    objeto.cliente = 1
    return objeto
}

function gerarJSONCidadesTA(){
    let objeto = {}
    objeto.nome = gerarStringAleatoria(300)
    objeto.pais = gerarStringAleatoria(300)
    objeto.latitude = gerarStringAleatoria(300)
    objeto.longitude =  gerarStringAleatoria(300)
    return objeto
}

function gerarJSONCidades() {
    let objeto = {}
    objeto.nome = gerarStringAleatoria(29)
    objeto.pais = _.upperCase(gerarStringAleatoria(2, true)).replace(/\s/g, "")
    objeto.latitude = (Math.random() * 90).toFixed(10)
    objeto.longitude =  (Math.random() * 180).toFixed(10)
    return objeto
}

function gerarJSONClientesTA(){
    let objeto = {}
    objeto.CPF = gerarStringAleatoria(300)
    objeto.nome = gerarStringAleatoria(300)
    objeto.email = gerarStringAleatoria(300)
    objeto.cidade = gerarStringAleatoria(300)
    objeto.bairro = gerarStringAleatoria(300)
    objeto.rua = gerarStringAleatoria(300)
    objeto.numeroCasa = gerarStringAleatoria(300)
    objeto.telefone = gerarStringAleatoria(300)
    objeto.dataNascimento = gerarStringAleatoria(300)
    objeto.complemento = gerarStringAleatoria(300)
    return objeto
}

function gerarJSONClientes() {
    let objeto = {}
    objeto.CPF = `${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}-${gerarStringDeNumerosAleatoria(2)}`
    objeto.nome = gerarStringAleatoria(10)
    objeto.email = `${gerarStringAleatoria(10)}@${gerarStringAleatoria(5)}.com`
    objeto.cidade = 1
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2, 1, 9)}) 9${gerarStringDeNumerosAleatoria(1, 1, 9)}${gerarStringDeNumerosAleatoria(3, 0, 9)}-${gerarStringDeNumerosAleatoria(4, 0, 9)}`
    objeto.dataNascimento = dataDeHoje().substring(0, 10)
    objeto.complemento = gerarStringAleatoria(50)
    return objeto
}

function gerarJSONFuncionariosTA(){
    let objeto = {}
    objeto.CPF = gerarStringAleatoria(300)
    objeto.nome = gerarStringAleatoria(300)
    objeto.email = gerarStringAleatoria(300)
    objeto.salario = gerarStringAleatoria(300)
    objeto.cidade = gerarStringAleatoria(300)
    objeto.bairro = gerarStringAleatoria(300)
    objeto.rua = gerarStringAleatoria(300)
    objeto.numeroCasa = gerarStringAleatoria(300)
    objeto.telefone = gerarStringAleatoria(300)
    objeto.dataNascimento = gerarStringAleatoria(300)
    objeto.complemento = gerarStringAleatoria(300)
    objeto.nivelAcesso = gerarStringAleatoria(300)
    objeto.senha = gerarStringAleatoria(300)
    return objeto
}

async function gerarJSONFuncionarios() {
    let objeto = {}
    objeto.CPF = `${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}-${gerarStringDeNumerosAleatoria(2)}`
    objeto.nome = gerarStringAleatoria(10)
    objeto.email = `${gerarStringAleatoria(10)}@${gerarStringAleatoria(5)}.com`
    objeto.salario = (Math.random() * (10000000000000 - 900) + 900)
    objeto.cidade = 1
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2, 1, 9)}) 9${gerarStringDeNumerosAleatoria(1, 1, 9)}${gerarStringDeNumerosAleatoria(3, 0, 9)}-${gerarStringDeNumerosAleatoria(4, 0, 9)}`
    objeto.dataNascimento = dataDeHoje().substring(0, 10)
    objeto.complemento = gerarStringAleatoria(50)
    objeto.nivelAcesso = 2
    objeto.senha = await bcrypt.hash("perestroika", 10)
    return objeto
}

function gerarJSONFornecedoresTA(){
    let objeto = {}
    objeto.CNPJ = gerarStringAleatoria(300)
    objeto.nome = gerarStringAleatoria(300)
    objeto.email = gerarStringAleatoria(300)
    objeto.cidade = gerarStringAleatoria(300)
    objeto.telefone = gerarStringAleatoria(300)
    objeto.bairro = gerarStringAleatoria(300)
    objeto.rua = gerarStringAleatoria(300)
    objeto.numeroCasa = gerarStringAleatoria(300)
    objeto.complemento = gerarStringAleatoria(300)
    return objeto
}

function gerarJSONFornecedores() {
    let objeto = {}
    objeto.CNPJ = `${gerarStringDeNumerosAleatoria(2)}.${gerarStringDeNumerosAleatoria(3)}.${gerarStringDeNumerosAleatoria(3)}/${gerarStringDeNumerosAleatoria(4)}-${gerarStringDeNumerosAleatoria(2)}`
    objeto.nome = gerarStringAleatoria(10)
    objeto.email = `${gerarStringAleatoria(10)}@${gerarStringAleatoria(5)}.com`
    objeto.cidade = 1
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2, 1, 9)}) 9${gerarStringDeNumerosAleatoria(1, 1, 9)}${gerarStringDeNumerosAleatoria(3, 0, 9)}-${gerarStringDeNumerosAleatoria(4, 0, 9)}`
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.complemento = gerarStringAleatoria(50)
    return objeto
}

function gerarJSONProdutosTA() {
    let objeto = {}
    objeto.nome = gerarStringAleatoria(300)
    objeto.categoria = gerarStringAleatoria(300)
    objeto.precoUnidade = gerarStringAleatoria(300)
    objeto.fornecedor = gerarStringAleatoria(300)
    objeto.descricao = gerarStringAleatoria(300)
    objeto.garantia = gerarStringAleatoria(300)
    objeto.dataFabricacao = gerarStringAleatoria(300)
    objeto.dataValidade = gerarStringAleatoria(300)
    return objeto
}

function gerarJSONProdutos() {
    let objeto = {}
    objeto.nome = gerarStringAleatoria(10)
    objeto.categoria = gerarStringAleatoria(10)
    objeto.precoUnidade = (Math.random() * (10000000 - 1) + 1)
    objeto.fornecedor = 1
    objeto.descricao = gerarStringAleatoria(50)
    objeto.garantia = Math.floor(Math.random() * 10)
    objeto.dataFabricacao = dataDeHoje().substring(0, 10)
    objeto.dataValidade = dataDeHoje().substring(0, 10)
    return objeto
}

function gerarJSONEstoqueTA() {
    let objeto = {}
    objeto.quantidade = gerarStringAleatoria(300)
    objeto.produto = gerarStringAleatoria(300)  
    objeto.armazem = gerarStringAleatoria(300)
    return objeto
}

function gerarJSONEstoque() {
    let objeto = {}
    objeto.quantidade = Math.floor(Math.random() * 100)
    objeto.produto = Math.floor(Math.random() * 100) + 1
    objeto.armazem = 10000
    return objeto
}

function gerarJSONArmazemTA(){
    let objeto = {}
    objeto.cidade = gerarStringAleatoria(300)
    objeto.bairro = gerarStringAleatoria(300)
    objeto.rua = gerarStringAleatoria(300)
    objeto.numeroCasa = gerarStringAleatoria(300)
    objeto.telefone = gerarStringAleatoria(300)
    return objeto
}

function gerarJSONArmazem(){
    let objeto = {}
    objeto.cidade = 1
    objeto.bairro = gerarStringAleatoria(10)
    objeto.rua = gerarStringAleatoria(10)
    objeto.numeroCasa = Math.floor(Math.random() * 100)
    objeto.telefone = `(${gerarStringDeNumerosAleatoria(2, 1, 9)}) 9${gerarStringDeNumerosAleatoria(1, 1, 9)}${gerarStringDeNumerosAleatoria(3, 0, 9)}-${gerarStringDeNumerosAleatoria(4, 0, 9)}`
    return objeto
}