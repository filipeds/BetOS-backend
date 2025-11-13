# BetOS - Backend
> Sistema de apostas desenvolvido como parte do projeto Jornada de Aprendizagem 2025-2 - UniSenai Londrina - Eng. de Software - 6P

## 📋 Sobre o Projeto
O BetOS é uma API REST desenvolvida em FastAPI que fornece funcionalidades de autenticação e gerenciamento de usuários para um sistema de apostas. O projeto utiliza MariaDB como banco de dados e implementa autenticação JWT com controle de acesso baseado em roles.

## 🚀 Tecnologias Utilizadas
- **FastAPI** - Framework web moderno e rápido para APIs
- **SQLAlchemy** - ORM para Python
- **MariaDB** - Sistema de gerenciamento de banco de dados
- **Alembic** - Ferramenta de migração de banco de dados
- **JWT** - Autenticação baseada em tokens
- **Docker** - Containerização da aplicação
- **Python 3.13** - Linguagem de programação

## 🏗️ Arquitetura
```
app/
├── api/v1/          # Endpoints da API
├── auth/            # Módulo de autenticação
├── core/            # Configurações e dependências
├── entities/        # Modelos de dados
├── routers/         # Roteadores da aplicação
└── services/        # Lógica de negócio
```

## 📦 Pré-requisitos
- Python 3.13+
- MariaDB 11.8+
- Docker (opcional)
- WSL com ArchLinux (para desenvolvimento local)

## 🛠️ Instalação e Configuração
### 1. Clone o repositório

```bash
git clone git@github.com:alexandremassaro/BetOS-backend.git
cd BetOS-backend
```

### 2. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# App Configuration
APP_NAME=BetOS
DEBUG=False

# Database Configuration
MARIADB_DATABASE=betos
MARIADB_USER=betos
MARIADB_PASSWORD=betos
MARIADB_ROOT_PASSWORD=betos
MARIADB_HOST=localhost
MARIADB_PORT=3306

# Security Configuration
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=50
```

### 3. Execução Local (WSL)
```bash
# Ativar ambiente virtual
wsl -d archlinux
source .venv/bin/activate

# Executar migrações e iniciar servidor
./initialize.sh
```

### 4. Execução com Docker
```bash
# Build da imagem
docker build -t betos-backend .

# Executar container
docker run -p 3000:80 betos-backend
```

### 5. Execução com Docker Compose
```bash
# Iniciar todos os serviços (API + Banco + Adminer)
docker-compose up -d
```

## 📚 Endpoints da API
### Autenticação
- `POST /api/v1/auth/login` - Login de usuário
- `POST /api/v1/auth/register` - Registro de usuário
- `POST /api/v1/auth/refresh` - Renovar token

### Usuários
- `GET /api/v1/users/me` - Obter dados do usuário logado
- `PUT /api/v1/users/me` - Atualizar dados do usuário
- `GET /api/v1/users/` - Listar usuários (admin)

### Health Check
- `GET /api/v1/health` - Status da aplicação

## 🗄️ Banco de Dados
O projeto utiliza MariaDB com as seguintes tabelas principais:
- **users** - Dados dos usuários
- **roles** - Roles/perfis de usuário
- **user_roles** - Relacionamento N:N entre usuários e roles

### Migrações
```bash
# Criar nova migração
uv run alembic revision --autogenerate -m "Descrição da migração"

# Aplicar migrações
uv run alembic upgrade head
```

## 🔧 Desenvolvimento
### Estrutura do Projeto

- **`app/main.py`** - Ponto de entrada da aplicação
- **`app/core/`** - Configurações e dependências
- **`app/api/v1/`** - Endpoints da API v1
- **`app/entities/`** - Modelos SQLAlchemy
- **`migrations/`** - Scripts de migração do Alembic

### Comandos Úteis
```bash
# Instalar dependências
uv sync

# Executar em modo desenvolvimento
uv run uvicorn app.main:app --reload

# Executar testes (quando implementados)
uv run pytest

# Verificar linting
uv run ruff check
```

## 🌐 Acesso
Após iniciar a aplicação:

- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/docs
- **Adminer** (se usando docker-compose): http://localhost:8080

## 📝 Licença
Este projeto foi desenvolvido como parte do projeto Jornada de Aprendizagem 2025-2 da UniSenai Londrina.
