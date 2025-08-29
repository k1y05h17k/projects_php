<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepositoryInterface;

final class UserService
{
    public function __construct(private UserRepositoryInterface $repo) {}

    /**
     * @param  array<string,mixed> $filters
     * @return array<int,array<string,mixed>>
     */
    public function list(array $filters = []): array
    {
        // Dica: aqui você pode normalizar filtros (ex.: role_level => (int), q => trim, etc.)
        return $this->repo->list($filters);
    }

    /**
     * @return array<string,mixed>|null
     */
    public function getById(string|int $id): ?array
    {
        return $this->repo->getById((string)$id);
    }

    /**
     * @param  array<string,mixed> $data
     * @return array<string,mixed>
     */
    public function create(array $data): array
    {
        /** @var User|null $auth */
        $auth = auth('api')->user();

        // Normalizações básicas
        if (isset($data['email'])) {
            $data['email'] = mb_strtolower(trim((string) $data['email']));
        }
        if (isset($data['name'])) {
            $data['name'] = trim((string) $data['name']);
        }

        // Senha obrigatória na criação
        if (empty($data['password'])) {
            // pode lançar exceção customizada ou deixar a Request validar antes de chegar aqui
            throw new \InvalidArgumentException('Password is required');
        }
        $data['password'] = bcrypt((string) $data['password']);

        // Permissões de role:
        if (!$auth || !$auth->isAdmin()) {
            $data['role_level'] = User::ROLE_READER; // força leitor (3)
        } else {
            $data['role_level'] = (int)($data['role_level'] ?? User::ROLE_READER);
            if (!in_array($data['role_level'], [User::ROLE_ADMIN, User::ROLE_MODERATOR, User::ROLE_READER], true)) {
                $data['role_level'] = User::ROLE_READER;
            }
        }

        return $this->repo->create($data);
    }

    /**
     * @param  array<string,mixed> $data
     * @return array<string,mixed>|null
     */
    public function update(string|int $id, array $data): ?array
    {
        /** @var User|null $auth */
        $auth = auth('api')->user();

        // Não-admin não pode alterar role_level
        if (array_key_exists('role_level', $data) && (!$auth || !$auth->isAdmin())) {
            unset($data['role_level']);
        } elseif (isset($data['role_level'])) {
            // Admin pode, mas valida o valor
            $data['role_level'] = (int) $data['role_level'];
            if (!in_array($data['role_level'], [User::ROLE_ADMIN, User::ROLE_MODERATOR, User::ROLE_READER], true)) {
                unset($data['role_level']);
            }
        }

        // Normalizações
        if (isset($data['email'])) {
            $data['email'] = mb_strtolower(trim((string) $data['email']));
        }
        if (isset($data['name'])) {
            $data['name'] = trim((string) $data['name']);
        }

        // Senha: se veio vazia, ignora; se veio preenchida, hash
        if (array_key_exists('password', $data)) {
            if ($data['password'] === null || $data['password'] === '') {
                unset($data['password']);
            } else {
                $data['password'] = bcrypt((string) $data['password']);
            }
        }

        return $this->repo->update((string)$id, $data);
    }

    public function delete(string|int $id): bool
    {
        /** @var User|null $auth */
        $auth = auth('api')->user();

        // Evita auto-exclusão (mesmo que a Policy já bloqueie, fica um “cinto de segurança”)
        if ($auth && (string)$auth->id === (string)$id) {
            // pode lançar exceção ou retornar false; aqui retorno false para o controller traduzir p/ 422/403
            return false;
        }

        return $this->repo->delete((string)$id);
    }
}
