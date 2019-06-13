CREATE DATABASE `lojaDoIgor`;

USE `lojaDoIgor`;

CREATE TABLE `cidades` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(30) NOT NULL,
    `UF` VARCHAR(2) NOT NULL,
    `CEP` VARCHAR(9) NOT NULL,
	`dataAlteracao` DATE NOT NULL,
    `dataCriacao` DATE NOT NULL,
    CONSTRAINT PK_cidades PRIMARY KEY (id)
);

CREATE TABLE `clientes` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `CPF` VARCHAR(14) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `idCidade` INT(11) NOT NULL,
	`dataAlteracao` DATE NOT NULL,
	`dataCriacao` DATE NOT NULL,
    `endereco` VARCHAR(255),
    `telefone` VARCHAR(15),
    `dataNasc` DATE,
    CONSTRAINT FK_clientes_cidades FOREIGN KEY (idCidade) REFERENCES cidades(id),
    CONSTRAINT PK_clientes PRIMARY KEY (id)
);

CREATE TABLE `funcionarios` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `CPF` VARCHAR(14) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
	`senha` VARCHAR(255) NOT NULL,
	`salario` DECIMAL(8, 2) NOT NULL,
	`idCidade` INT(11) NOT NULL,
	`nivelAcesso` INT(11) NOT NULL,
	`dataAlteracao` DATE NOT NULL,
	`dataCriacao` DATE NOT NULL,
    `endereco` VARCHAR(255),
    `telefone` VARCHAR(15),
    `dataNasc` DATE,
	CONSTRAINT FK_funcionarios_cidades FOREIGN KEY (idCidade) REFERENCES cidades(id),
    CONSTRAINT PK_funcionarios PRIMARY KEY (id)
);

CREATE TABLE `fornecedores` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `CNPJ` VARCHAR(18) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
	`idCidade` INT(11) NOT NULL,
	`dataAlteracao` DATE NOT NULL,
	`dataCriacao` DATE NOT NULL,
    `endereco` VARCHAR(255),
    `telefone` VARCHAR(15),
	CONSTRAINT FK_fornecedores_cidades FOREIGN KEY (idCidade) REFERENCES cidades(id),
    CONSTRAINT PK_fornecedores PRIMARY KEY (id)
);

CREATE TABLE `produtos` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
	`categoria` VARCHAR(100),  
    `precoUnidade` DECIMAL(8,2) NOT NULL,
    `idFornecedor` INT(11) NOT NULL,
	`dataAlteracao` DATE NOT NULL,
	`dataCriacao` DATE NOT NULL,
	`imagem` BLOB NOT NULL,
    `descricao` TEXT NOT NULL,
    `garantia` INT(11),
	`dataFabric` DATE,
	`dataValidade` DATE,
	CONSTRAINT FK_produtos_fornecedores FOREIGN KEY (idFornecedor) REFERENCES fornecedores(id),
    CONSTRAINT PK_produtos PRIMARY KEY (id)
);

CREATE TABLE `estoque` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `quantidade` INT(11) NOT NULL,
    `idProduto` INT(11) NOT NULL,
	`dataAlteracao` DATE NOT NULL,
	`dataCriacao` DATE NOT NULL,
	CONSTRAINT FK_estoque_produtos FOREIGN KEY (idProduto) REFERENCES produtos(id),
    CONSTRAINT PK_estoque PRIMARY KEY (id)
);

CREATE TABLE `vendas` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `valorTotal` DECIMAL(8,2) NOT NULL,
    `idFuncionario` INT(11) NOT NULL,
    `idCliente` INT(11) NOT NULL,
    `dataAlteracao` DATE NOT NULL,
	`dataCriacao` DATE NOT NULL,
	CONSTRAINT FK_vendas_funcionarios FOREIGN KEY (idFuncionario) REFERENCES funcionarios(id),
	CONSTRAINT FK_vendas_cliente FOREIGN KEY (idCliente) REFERENCES clientes(id),
    CONSTRAINT PK_vendas PRIMARY KEY (id)
);

CREATE TABLE `itensVenda` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `valorTotal` DECIMAL(8,2) NOT NULL,
	`quantidade` INT(11) NOT NULL,
    `idProduto` INT(11) NOT NULL,
    `idVenda` INT(11) NOT NULL,
    `dataAlteracao` DATE NOT NULL,
	`dataCriacao` DATE NOT NULL,
	CONSTRAINT FK_itensVenda_produtos FOREIGN KEY (idProduto) REFERENCES produtos(id),
	CONSTRAINT FK_itensVenda_vendas FOREIGN KEY (idVenda) REFERENCES vendas(id),
    CONSTRAINT PK_itensVenda PRIMARY KEY (id)
);








