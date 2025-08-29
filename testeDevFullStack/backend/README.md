content = """# Backend – Prova Fullstack (Laravel + JWT + SQLite + Docker)

API REST básica com autenticação **JWT**, controle de acesso por **perfis (role_level)** e respostas de erro **JSON** padronizadas.

## Stack
- PHP 8.2 + Laravel 12
- JWT: `php-open-source-saver/jwt-auth`
- Banco: **SQLite**
- Docker: PHP-FPM (e Nginx opcional)
- Padrões: Controllers + Requests + Services + Repositories + Policies

---

## Perfis (role_level)
- **1 – Administrador**: visualizar, **editar e excluir** outros usuários.
- **2 – Moderador**: visualizar e **editar** outros usuários (não exclui).
- **3 – Leitor**: **apenas visualizar** (não edita, não exclui).

---

## Requisitos
- Docker + Docker Compose
- (Opcional local) PHP 8.2, Composer, SQLite3

---

## Endpoints
  ## Auth

- POST /api/auth/login → {"email","password"}

  - 200 { access_token, token_type, expires_in }

  - 401 { message: "Invalid credentials" }

- GET /api/auth/me (Bearer) → 200 dados do usuário autenticado

- POST /api/auth/logout (Bearer) → 200 { message: "Logged out" }

- POST /api/auth/refresh (Bearer) → 200 novo token

## Users (todas exigem Bearer)

- GET /api/users → lista simples [ { id, name, email, role_level }, ... ]

- GET /api/users/{id}

- POST /api/users → cria usuário

    - Admin pode definir role_level (1/2/3)

    - Não-admin: role_level é forçado para 3 (Leitor)

 - PUT /api/users/{id}

    - Admin/Moderador podem editar outros

- Regras de autoedição conforme policy

- DELETE /api/users/{id}

  - Apenas Admin e não pode excluir a si mesmo

## Códigos e erros comuns

- 401 {"message":"Unauthenticated"}

- 403 {"message":"Forbidden"}

- 404 {"message":"Not found"}

- 405 {"message":"Method not allowed"}

- 422 {"message":"Validation failed","errors":{...}}

- 429 {"message":"Too many requests"}

- 500 {"message":"Internal server error"}

As respostas JSON são centralizadas em bootstrap/app.php via ->withExceptions(...).

## Exemplos (curl)

1) Login

```
curl -s -X POST http://localhost:8080/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@example.com","password":"admin123"}'
```
