# Prova Fullstack (Laravel + JWT + SQLite + Docker)

API REST básica com autenticação **JWT**, controle de acesso por **perfis (role_level)** e respostas de erro **JSON** padronizadas.


## Stack
**Backend**
- PHP 8.2 + **Laravel 12**
- JWT: `php-open-source-saver/jwt-auth`
- Banco: **SQLite**
- Padrões: Controllers + Requests + Services + Repositories + Policies
- Respostas/erros JSON centralizados em `bootstrap/app.php` via `->withExceptions(...)`

**Frontend**
- **React** + **Vite** (ou CRA) + **TypeScript** (opcional)
- **Tailwind CSS**
- **React Router** para rotas
- **Axios** para HTTP com interceptors (Auth Bearer + refresh)
---
**Infra**
- **Docker** + Docker Compose (PHP-FPM; Nginx opcional)
---

### Obrigatórias (ambiente)
- **Docker** + **Docker Compose**  
  *ou*, para rodar localmente sem Docker:
  - **PHP 8.2+**, **Composer**, **SQLite3**, **Node 18+**

### Backend (Composer)
- `laravel/framework:^12`
- `php-open-source-saver/jwt-auth:^2.2`
- (opcional) `laravel/sail`, `laravel/tinker`, `fakerphp/faker` (dev), `phpunit/phpunit` (dev)

### Frontend (npm)
- `react`, `react-dom`
- `axios`
- `react-router-dom`
- `tailwindcss`, `postcss`, `autoprefixer`
- (opcional) `@types/react`, `@types/react-dom`, `typescript`

> **.gitignore** deve ignorar: `node_modules/`, `dist/`, `vendor/`, `.env`, `storage/` (exceto `storage/framework/.gitignore`), `database/database.sqlite` (se desejar não versionar).


## 📂 Estrutura do Projeto

```bash
.
├── backend/        # API em Laravel (PHP + SQLite)
├── frontend/       # Interface em React + Tailwind
├── docker/         # Configurações e scripts do Docker
├── docker-compose.yml
└── README.md
```
## Passos para instalação

1) Copie o `.env` base (ou `.env.docker` -> `.env`) e defina o SQLite **absoluto**:
```dotenv
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080
APP_TIMEZONE=America/Sao_Paulo

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

JWT_SECRET= # será preenchido via artisan
```

2) Crie o arquivo do SQLite no host:
```bash
type nul > backend\database\database.sqlite   # Windows
# ou
touch backend/database/database.sqlite        # macOS/Linux
```

3) Suba os contêineres:
```bash
cd docker
docker compose up -d --build
```

4) Instale dependências e gere chaves **dentro do container**:
```bash
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan optimize:clear
```

5) Instale e configure **JWT**:
```bash
docker compose exec app composer require php-open-source-saver/jwt-auth:"^2.2"
docker compose exec app php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"
docker compose exec app php artisan jwt:secret
docker compose exec app php artisan optimize:clear
```

A API ficará disponível em: **http://localhost:8080**

---

## Backend — Endpoints e Políticas


### Auth
- **POST** `/api/auth/login` → `{"email","password"}`
  - **200** `{ access_token, token_type, expires_in }`
  - **401** `{ message: "Invalid credentials" }`
- **GET** `/api/auth/me` *(Bearer)* → **200** dados do usuário autenticado
- **POST** `/api/auth/logout` *(Bearer)* → **200** `{ message: "Logged out" }`
- **POST** `/api/auth/refresh` *(Bearer)* → **200** novo token

### Users *(todas exigem Bearer)*
- **GET** `/api/users` → lista simples `[ { id, name, email, role_level }, ... ]`
- **GET** `/api/users/{id}`
- **POST** `/api/users` → cria usuário  
  - Admin pode definir `role_level` (1/2/3)  
  - Não-admin: `role_level` é forçado para **3 (Leitor)**
- **PUT** `/api/users/{id}`  
  - Admin/Moderador podem editar outros  
  - Regras de autoedição conforme policy
- **DELETE** `/api/users/{id}`  
  - **Apenas Admin** e não pode excluir a si mesmo

**Códigos e erros comuns**
- **401** `{"message":"Unauthenticated"}`
- **403** `{"message":"Forbidden"}`
- **404** `{"message":"Not found"}`
- **405** `{"message":"Method not allowed"}`
- **422** `{"message":"Validation failed","errors":{...}}`
- **429** `{"message":"Too many requests"}`
- **500** `{"message":"Internal server error"}`

## Backend Endpoints (curl)

### 1) Login
```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 2) Me
```bash
curl -s http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### 3) Criar usuário (como Admin)
```bash
curl -s -X POST http://localhost:8080/api/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie","email":"charlie@example.com","password":"secret123","role_level":2}'
```

### 4) Listar usuários
```bash
curl -s http://localhost:8080/api/users \
  -H "Authorization: Bearer <TOKEN>"
```


## Frontend — Rotas e Consumo de API

### Rotas (UI)

- **/login — Formulário de autenticação (email/senha)**

- **/users — Listagem de usuários (com número e nome do nível)**

- **Topbar — Exibe o nome do nível ao lado do botão Sair**

---

## Niveis e Regras de acesso (resumo)
- `role_level` salvo em `users.role_level`
- Helpers no Model `User`: `isAdmin()`, `isModerator()`, `isReader()`
- **Regras de acesso**:
  - `viewAny/view`: todos usuários autenticados
  - `create`: usuário Admin / Novos usuários
  - `update`: usuário Admin / Moderador
  - `delete`: usuário Admin (não pode excluir a si mesmo)

---


