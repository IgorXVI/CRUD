CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nivelAcesso INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
    dataCriacao VARCHAR(24) NOT NULL
);

CREATE TABLE IF NOT EXISTS cidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(30) NOT NULL,
    UF VARCHAR(2) NOT NULL,
    CEP VARCHAR(9) NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
    dataCriacao VARCHAR(24) NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CPF VARCHAR(14) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    idCidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    bairro VARCHAR(25) NOT NULL,
    rua VARCHAR(25) NOT NULL,
    numeroCasa INTEGER NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    dataNasc VARCHAR(10) NOT NULL,
    complemento VARCHAR(255),
    FOREIGN KEY (idCidade) REFERENCES cidades(id)
);

CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CPF VARCHAR(14) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
	salario REAL NOT NULL,
    idCidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    bairro VARCHAR(25) NOT NULL,
    rua VARCHAR(25) NOT NULL,
    numeroCasa INTEGER NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    dataNasc VARCHAR(10) NOT NULL,
    complemento VARCHAR(255),
    FOREIGN KEY (idCidade) REFERENCES cidades(id)
);

CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CNPJ VARCHAR(18) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    idCidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    bairro VARCHAR(25) NOT NULL,
    rua VARCHAR(25) NOT NULL,
    numeroCasa INTEGER NOT NULL,
    complemento VARCHAR(255),
	FOREIGN KEY (idCidade) REFERENCES cidades(id)
);

CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
	categoria VARCHAR(100),  
    precoUnidade REAL NOT NULL,
    idFornecedor INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    descricao TEXT NOT NULL,
    garantia INTEGER NOT NULL,
	dataFabric VARCHAR(10) NOT NULL,
	dataValidade VARCHAR(10) NOT NULL,
	FOREIGN KEY (idFornecedor) REFERENCES fornecedores(id)
);

CREATE TABLE IF NOT EXISTS estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quantidade INTEGER NOT NULL,
    idProduto INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (idProduto) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valorTotal REAL NOT NULL,
    idFuncionario INTEGER NOT NULL,
    idCliente INTEGER NOT NULL,
    dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (idFuncionario) REFERENCES funcionarios(id),
	FOREIGN KEY (idCliente) REFERENCES clientes(id)
);

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
);

CREATE TABLE IF NOT EXISTS url (
    tabela VARCHAR(255) PRIMARY KEY,
    urlString VARCHAR(255)
);