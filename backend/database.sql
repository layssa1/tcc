-- ============================================================================
-- SCRIPT DE CRIAÇÃO E POVOAMENTO DO BANCO DE DADOS
-- Projeto: ReservaLab — Gestão e Agendamento Escolar (E.E. Monsenhor Bicudo)
-- SGBD: MySQL 8.0+ / MariaDB
-- ============================================================================

-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS reservalab
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reservalab;

-- Desativa temporariamente checagem de chaves estrangeiras para recriação limpa
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS equipamentos;
DROP TABLE IF EXISTS espacos;
DROP TABLE IF EXISTS professores;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 2. CRIAÇÃO DAS TABELAS
-- ============================================================================

-- Tabela: professores
CREATE TABLE professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    rg VARCHAR(20),
    email VARCHAR(150) NOT NULL UNIQUE,
    disciplina VARCHAR(100) NOT NULL,
    status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela: usuarios (Autenticação e Controle de Acesso RBAC)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'professor') NOT NULL DEFAULT 'professor',
    cargo VARCHAR(100),
    avatar VARCHAR(10),
    disciplina VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_professores 
        FOREIGN KEY (professor_id) REFERENCES professores(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabela: espacos (Salas, Laboratórios, Auditório)
CREATE TABLE espacos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(80) NOT NULL,
    capacidade INT NOT NULL DEFAULT 30,
    equipamentos TEXT, -- Lista ou descrição de itens integrados ao espaço
    status ENUM('Disponível', 'Ocupado', 'Em manutenção') DEFAULT 'Disponível',
    icone VARCHAR(50) DEFAULT '🏫',
    localizacao VARCHAR(150),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela: equipamentos (Itens avulsos/móveis para empréstimo)
CREATE TABLE equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    quantidade_total INT NOT NULL DEFAULT 1,
    quantidade_disponivel INT NOT NULL DEFAULT 1,
    status ENUM('Disponível', 'Em uso', 'Em manutenção') DEFAULT 'Disponível',
    icone VARCHAR(50) DEFAULT '📦',
    patrimonio VARCHAR(50) UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela: reservas (Agendamento de Espaços e Recursos)
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    espaco_id INT NOT NULL,
    equipamento_nome VARCHAR(150) DEFAULT 'Nenhum',
    dia_semana ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado') NOT NULL,
    data DATE NOT NULL,
    semana VARCHAR(30) DEFAULT 'Semana 40',
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    turma VARCHAR(100) NOT NULL,
    observacao TEXT,
    status ENUM('Confirmada', 'Pendente', 'Cancelada') DEFAULT 'Confirmada',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservas_professores 
        FOREIGN KEY (professor_id) REFERENCES professores(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reservas_espacos 
        FOREIGN KEY (espaco_id) REFERENCES espacos(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Índices para otimização de busca de conflitos e agendas
CREATE INDEX idx_reservas_data_horario ON reservas (espaco_id, data, horario_inicio, horario_fim);
CREATE INDEX idx_reservas_professor ON reservas (professor_id);

-- ============================================================================
-- 3. INSERÇÃO DE DADOS INICIAIS (SEED DATA DO RESERVALAB)
-- ============================================================================

-- Inserir Professores
INSERT INTO professores (id, nome, rg, email, disciplina, status, telefone) VALUES
(1, 'Prof. Carlos Eduardo', '12.345.678-9', 'carlos.eduardo@escola.gov.br', 'Matemática & Robótica', 'Ativo', '(14) 99876-1122'),
(2, 'Profª. Mariana Silveira', '23.456.789-0', 'mariana.silveira@escola.gov.br', 'Língua Portuguesa & Literatura', 'Ativo', '(14) 99765-2233'),
(3, 'Prof. Ricardo Almeida', '34.567.890-1', 'ricardo.almeida@escola.gov.br', 'Física & Tecnologia', 'Ativo', '(14) 99654-3344'),
(4, 'Profª. Amanda Cristina', '45.678.901-2', 'amanda.cristina@escola.gov.br', 'História & Filosofia', 'Ativo', '(14) 99543-4455'),
(5, 'Prof. Marcos Oliveira', '56.789.012-3', 'marcos.oliveira@escola.gov.br', 'Ciências & Biologia', 'Ativo', '(14) 99432-5566');

-- Inserir Usuários (Admin e Professores com acesso)
INSERT INTO usuarios (id, professor_id, nome, email, senha, perfil, cargo, avatar, disciplina) VALUES
(1, NULL, 'Coordenação Escolar', 'gestao@bicudo.escola.gov.br', 'admin123', 'admin', 'Gestão Escolar', 'AD', NULL),
(2, 1, 'Prof. Carlos Eduardo', 'carlos.eduardo@escola.gov.br', 'prof123', 'professor', 'Docente de Matemática & Robótica', 'CE', 'Matemática & Robótica'),
(3, 2, 'Profª. Mariana Silveira', 'mariana.silveira@escola.gov.br', 'prof123', 'professor', 'Docente de Língua Portuguesa & Literatura', 'MS', 'Língua Portuguesa & Literatura');

-- Inserir Espaços Escolares
INSERT INTO espacos (id, nome, tipo, capacidade, equipamentos, status, icone, localizacao) VALUES
(1, 'Laboratório de Informática 1', 'Informática', 32, '32 Computadores, 1 Projetor, Ar-condicionado', 'Disponível', '💻', 'Bloco A — 1º Andar'),
(2, 'Laboratório de Informática 2', 'Informática', 30, '30 Computadores, Lousa Digital, Ar-condicionado', 'Disponível', '🖥️', 'Bloco A — 1º Andar'),
(3, 'Sala Maker & Robótica', 'Laboratório Especial', 25, 'Bancadas, Kits Arduino, Impressora 3D', 'Disponível', '🤖', 'Bloco B — Térreo'),
(4, 'Sala de Leitura & Multimídia', 'Multiuso', 40, 'Projetor, Acervo Didático, Sistema de Som', 'Disponível', '📚', 'Biblioteca Central'),
(5, 'Salão Nobre / Auditório', 'Auditório', 120, 'Telão HD, Mesa de Som, Microfones Sem Fio', 'Disponível', '🎭', 'Prédio Principal'),
(6, 'Laboratório de Ciências', 'Ciências', 30, 'Microscópios, Vidrarias, Capela', 'Disponível', '🔬', 'Bloco C — 2º Andar');

-- Inserir Equipamentos
INSERT INTO equipamentos (id, nome, categoria, quantidade_total, quantidade_disponivel, status, icone, patrimonio) VALUES
(1, 'Projetor Epson HD 3500 Lumens', 'Áudio & Vídeo', 8, 6, 'Disponível', '📽️', 'PAT-2026-081'),
(2, 'Notebooks Dell Inspiron i5 (Carrinho)', 'Informática', 25, 18, 'Disponível', '💻', 'PAT-2026-102'),
(3, 'Kits de Robótica Educacional Arduino', 'Robótica', 10, 8, 'Disponível', '🤖', 'PAT-2026-215'),
(4, 'Caixas de Som Portáteis Bluetooth JBL', 'Áudio', 6, 4, 'Disponível', '🔊', 'PAT-2026-340'),
(5, 'Impressora 3D Creality Ender', 'Maker', 2, 2, 'Disponível', '🖨️', 'PAT-2026-401'),
(6, 'Microfones Sem Fio Duplos', 'Áudio', 5, 4, 'Disponível', '🎙️', 'PAT-2026-512');

-- Inserir Reservas Iniciais
INSERT INTO reservas (id, professor_id, espaco_id, equipamento_nome, dia_semana, data, semana, horario_inicio, horario_fim, turma, observacao, status) VALUES
(1, 1, 1, 'Projetor Epson HD', 'Segunda', '2026-09-28', 'Semana 40', '08:00:00', '09:40:00', '3º Ano A - Ensino Médio', 'Aula prática de lógica e programação', 'Confirmada'),
(2, 2, 4, 'Projetor Epson HD', 'Segunda', '2026-09-28', 'Semana 40', '10:00:00', '11:40:00', '2º Ano B - Ensino Médio', 'Seminário de Modernismo Literário', 'Confirmada'),
(3, 3, 3, 'Kits Arduino', 'Terça', '2026-09-29', 'Semana 40', '08:00:00', '09:40:00', '1º Ano C - Ensino Médio', 'Circuito de automação com sensores', 'Confirmada'),
(4, 4, 5, 'Caixa de Som JBL', 'Quarta', '2026-09-30', 'Semana 40', '13:30:00', '15:10:00', 'Ensino Médio Integral', 'Cine-debate histórico', 'Confirmada'),
(5, 5, 6, 'Nenhum', 'Quinta', '2026-10-01', 'Semana 40', '09:00:00', '10:40:00', '9º Ano A - Fundamental', 'Análise microscópica celular', 'Confirmada');
