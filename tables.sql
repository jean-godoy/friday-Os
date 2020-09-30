-- //arquivo das tabelas que serão usadas no app

--user table
CREATE TABLE users(
    id_user             INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_name           VARCHAR(50) NOT NULL,
    user_email          VARCHAR(50) NOT NULL,
    user_pass           VARCHAR(100) NOT NULL, 
    token               VARCHAR(100) NOT NULL,
    create_at           TIMESTAMP                

);

--INSERT INTO users(user_name, user_email, user_pass, token, create_at) VALUES ( 'godoy', 'seidecapital@gmail.com', 12345, '1b2b3c4d5e', '2020-09-27 12:44:50' )

-- tabela clientes
CREATE TABLE clientes(
    id_cliente          INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome                VARCHAR(100),
    telefone            FLOAT,
    email               VARCHAR(100),
    cpf                 INT(11),
    data_nasc           DATE,
    sexo                INT
);

CREATE TABLE cliente_dados(
    id          INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente  INT NOT NULL,
    endereco    VARCHAR(150),
    numero      INT,
    bairro      VARCHAR(100),
    cidade      VARCHAR(100),
    cep         VARCHAR(50),
    estado      VARCHAR(50),
    create_at   TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

CREATE TABLE dispositivos(
    id              INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente      INT NOT NULL,
    dispositivo     VARCHAR(150),
    marca           VARCHAR(150),
    modelo          VARCHAR(150),
    numero_serie    VARCHAR(150),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

CREATE TABLE ficha_entrada(
    id                  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_dispositivo      INT NOT NULL,
    defeito_relatado    VARCHAR(200),
    data_entrada        TIMESTAMP,
    status              INT,
    FOREIGN KEY (id_dispositivo) REFERENCES dispositivos(id) ON DELETE CASCADE
);

CREATE TABLE orcamentos(
    id_orcamento        INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_ficha            INT NOT NULL,
    id_dispositivo      INT NOT NULL,
    id_cliente          INT NOT NULL,
    nome_cliente        VARCHAR(150),
    defeito             VARCHAR(250),
    dispositivo         VARCHAR(150),
    marca               VARCHAR(150),
    modelo              VARCHAR(150),
    relatorio           TEXT,
    obs                 TEXT,
    valor_total         FLOAT,
    create_at           TIMESTAMP,
    FOREIGN KEY (id_ficha) REFERENCES ficha_entrada(id)
);

CREATE TABLE orcamento_laudo(
    id_laudo            INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente          INT NOT NULL,
    id_orcamento        INT NOT NULL,
    id_dispositivo      INT NOT NULL,
    equipamento         VARCHAR(150) NOT NULL,
    marca               VARCHAR(150) NOT NULL,
    modelo              VARCHAR(150) NOT NULL,
    nome_cliente        VARCHAR(150) NOT NULL,
    data_entrada        TIMESTAMP,
    defeito_relatado    VARCHAR(250),
    defeito_apresentado VARCHAR(250),
    laudo_tecnico       TEXT,
    descricao_produtos  TEXT,
    valor_total         FLOAT,
    create_at           TIMESTAMP,
    FOREIGN KEY (id_orcamento) REFERENCES orcamentos(id_orcamento)
);

-- SELECT clientes.nome, dispositivos.*, ficha_entrada.* FROM clientes, dispositivos, ficha_entrada WHERE dispositivos.id = ficha_entrada.id_dispositivo AND clientes.id_cliente = dispositivos.id_cliente  AND ficha_entrada.id = 2
SELECT dispositivos.*, ficha_entrada.* FROM dispositivos, ficha_entrada WHERE dispositivos.id = ficha_entrada.id_dispositivo;

 