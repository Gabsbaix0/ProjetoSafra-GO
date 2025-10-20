-- Criação do Banco de Dados
CREATE DATABASE SafraGo;

-- Seleção do Banco de Dados
USE SafraGo;

-- Tabela Principal de Usuários
-- Observação: A senha foi alterada para VARCHAR(255) para armazenar o HASH criptográfico.
CREATE TABLE usuario (
    id_usuario INTEGER NOT NULL AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- CRÍTICO: Armazenar hash da senha, não a senha em texto simples.
    telefone VARCHAR(20) NOT NULL, -- Tamanho aumentado para flexibilidade
    tipo_usuario CHAR(1) NOT NULL, -- 'P' para Produtor, 'C' para Comprador
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Registra a data de criação automaticamente
    PRIMARY KEY (id_usuario)
) ENGINE=InnoDB;

-- Tabela de Comprador (Relação 1:1 com Usuario - fk_usuario é PK e FK)
CREATE TABLE comprador (
    fk_usuario INTEGER NOT NULL, -- É a chave primária (PK) e estrangeira (FK)
    endereco VARCHAR(150) NOT NULL,
    PRIMARY KEY (fk_usuario),
    FOREIGN KEY (fk_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

-- Tabela de Produtor (Relação 1:1 com Usuario - fk_usuario é PK e FK)
CREATE TABLE produtor (
    fk_usuario INTEGER NOT NULL, -- É a chave primária (PK) e estrangeira (FK)
    nome_fazenda VARCHAR(50) NOT NULL,
    endereco VARCHAR(150) NOT NULL,
    descricao TEXT, -- Mantido como TEXT para descrições longas
    PRIMARY KEY (fk_usuario),
    FOREIGN KEY (fk_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

-- Tabela de Produtos
CREATE TABLE produto (
    id_produto INTEGER NOT NULL AUTO_INCREMENT,
    nome_produto VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT, -- Alterado para TEXT
    data_publicacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INTEGER NOT NULL, -- Quem publicou (o Produtor/Vendedor)
    PRIMARY KEY (id_produto),
    FOREIGN KEY (fk_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

-- Tabela de Favoritos
CREATE TABLE favorito (
    id_favorito INTEGER NOT NULL AUTO_INCREMENT,
    data_favorito DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INTEGER NOT NULL, -- Quem favoritou
    fk_produto INTEGER NOT NULL,
    PRIMARY KEY(id_favorito),
    FOREIGN KEY(fk_usuario) REFERENCES usuario (id_usuario),
    FOREIGN KEY(fk_produto) REFERENCES produto (id_produto),
    -- Garante que um usuário só pode favoritar o mesmo produto uma vez
    UNIQUE KEY (fk_usuario, fk_produto) 
) ENGINE=InnoDB;


CREATE TABLE mensagem (
    id_mensagem INTEGER NOT NULL AUTO_INCREMENT,
    conteudo TEXT NOT NULL,
    data_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_usuario_remetente INTEGER NOT NULL, -- Quem enviou
    fk_usuario_destinatario INTEGER NOT NULL, -- Quem recebeu
    PRIMARY KEY(id_mensagem),
    FOREIGN KEY(fk_usuario_remetente) REFERENCES usuario(id_usuario),
    FOREIGN KEY(fk_usuario_destinatario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;