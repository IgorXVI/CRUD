const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./data.db", (erro) => {
    if (erro) {
        console.error(erro.message)
    }

    console.log("Conectado ao banco de dados SQLite data.db")
})

const CIDADES_SCHEMA = `
CREATE TABLE IF NOT EXISTS cidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(30) NOT NULL,
    UF VARCHAR(2) NOT NULL,
    CEP VARCHAR(9) NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
    dataCriacao VARCHAR(24) NOT NULL
)
`
const CLIENTES_SCHEMA = `
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CPF VARCHAR(14) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    idCidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(15),
    dataNasc VARCHAR(10),
    FOREIGN KEY (idCidade) REFERENCES cidades(id)
)
`
const FUNCIONARIOS_SCHEMA = `
CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CPF VARCHAR(14) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
	salario REAL NOT NULL,
    idCidade INTEGER NOT NULL,
    nivelAcesso INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(15),
    dataNasc VARCHAR(10),
    FOREIGN KEY (idCidade) REFERENCES cidades(id)
)
`
const FORNECEDORES_SCHEMA = `
CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CNPJ VARCHAR(18) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
	idCidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(15),
	FOREIGN KEY (idCidade) REFERENCES cidades(id)
)
`
const PRODUTOS_SCHEMA = `
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
	categoria VARCHAR(100),  
    precoUnidade REAL NOT NULL,
    idFornecedor INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	imagem BLOB NOT NULL,
    descricao TEXT NOT NULL,
    garantia INTEGER,
	dataFabric VARCHAR(10),
	dataValidade VARCHAR(10),
	FOREIGN KEY (idFornecedor) REFERENCES fornecedores(id)
)
`

const ESTOQUE_SCHEMA = `
CREATE TABLE IF NOT EXISTS estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quantidade INTEGER NOT NULL,
    idProduto INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (idProduto) REFERENCES produtos(id)
)
`

const VENDAS_SCHEMA = `
CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valorTotal REAL NOT NULL,
    idFuncionario INTEGER NOT NULL,
    idCliente INTEGER NOT NULL,
    dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (idFuncionario) REFERENCES funcionarios(id),
	FOREIGN KEY (idCliente) REFERENCES clientes(id)
)
`
const ITENS_VENDA_SCHEMA = `
CREATE TABLE IF NOT EXISTS itensVenda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valorTotal REAL NOT NULL,
	quantidade INTEGER NOT NULL,
    idProduto INTEGER NOT NULL,
    idVenda INTEGER NOT NULL,
    dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (idProduto) REFERENCES produtos(id),
	FOREIGN KEY (idVenda) REFERENCES vendas(id)
)
`

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON")
    db.run(CIDADES_SCHEMA)
    db.run(CLIENTES_SCHEMA)
    db.run(FUNCIONARIOS_SCHEMA)
    db.run(FORNECEDORES_SCHEMA)
    db.run(PRODUTOS_SCHEMA)
    db.run(ESTOQUE_SCHEMA)
    db.run(VENDAS_SCHEMA)
    db.run(ITENS_VENDA_SCHEMA)
});

process.on("SIGINT", () =>
    db.close((erro) => {
        if (erro) {
            console.error(erro.message)
            return
        }
        console.log("A conexão com o banco de dados SQLite data.db foi fechada.")
    })
);

module.exports = db