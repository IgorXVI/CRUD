CREATE TABLE IF NOT EXISTS cidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(30) NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    pais VARCHAR(2) NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
    dataCriacao VARCHAR(24) NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CPF VARCHAR(14) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    bairro VARCHAR(25) NOT NULL,
    rua VARCHAR(25) NOT NULL,
    numeroCasa INTEGER NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    dataNascimento VARCHAR(10) NOT NULL,
    complemento VARCHAR(255),
    FOREIGN KEY (cidade) REFERENCES cidades(id)
);

CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CPF VARCHAR(14) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
	salario REAL NOT NULL,
    cidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    bairro VARCHAR(25) NOT NULL,
    rua VARCHAR(25) NOT NULL,
    numeroCasa INTEGER NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    dataNascimento VARCHAR(10) NOT NULL,
    senha VARCHAR(8) NOT NULL,
    nivelAcesso INTEGER NOT NULL,
    complemento VARCHAR(255),
    FOREIGN KEY (cidade) REFERENCES cidades(id)
);

CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CNPJ VARCHAR(18) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    bairro VARCHAR(25) NOT NULL,
    rua VARCHAR(25) NOT NULL,
    numeroCasa INTEGER NOT NULL,
    complemento VARCHAR(255),
	FOREIGN KEY (cidade) REFERENCES cidades(id)
);

CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
	categoria VARCHAR(100),  
    precoUnidade REAL NOT NULL,
    fornecedor INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
    descricao TEXT NOT NULL,
    garantia INTEGER NOT NULL,
	dataFabricacao VARCHAR(10) NOT NULL,
	dataValidade VARCHAR(10) NOT NULL,
	FOREIGN KEY (fornecedor) REFERENCES fornecedores(id)
);

CREATE TABLE IF NOT EXISTS estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quantidade INTEGER NOT NULL,
    produto INTEGER NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    bairro VARCHAR(25) NOT NULL,
    rua VARCHAR(25) NOT NULL,
    numeroCasa INTEGER NOT NULL,
    complemento VARCHAR(255),
    cidade INTEGER NOT NULL,
	dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (produto) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valorTotal REAL NOT NULL,
    funcionario INTEGER NOT NULL,
    cliente INTEGER NOT NULL,
    dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (funcionario) REFERENCES funcionarios(id),
	FOREIGN KEY (cliente) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS itensVenda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valorTotal REAL NOT NULL,
	quantidade INTEGER NOT NULL,
    produto INTEGER NOT NULL,
    venda INTEGER NOT NULL,
    dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (produto) REFERENCES produtos(id),
	FOREIGN KEY (venda) REFERENCES vendas(id)
);

CREATE TABLE IF NOT EXISTS transportes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	quantidade INTEGER NOT NULL,
    estoque INTEGER NOT NULL,
    itemVenda INTEGER NOT NULL,
    dataAlteracao VARCHAR(24) NOT NULL,
	dataCriacao VARCHAR(24) NOT NULL,
	FOREIGN KEY (estoque) REFERENCES estoque(id),
	FOREIGN KEY (itemVenda) REFERENCES itensVenda(id)
);