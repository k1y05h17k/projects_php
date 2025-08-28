<?php

namespace App\Services;

use App\Repositories\UserRepositoryInterface;

class UserService
{
    public function __construct(private UserRepositoryInterface $repo) {}

    public function list(array $filters = []): array
    {
        return $this->repo->list($filters);
    }

    public function getById(string $id): ?array
    {
        return $this->repo->getById($id);
    }

    public function create(array $data): array
    {
        return $this->repo->create($data);
    }

    public function update(string $id, array $data): ?array
    {
        return $this->repo->update($id, $data);
    }

    public function delete(string $id): bool
    {
        return $this->repo->delete($id);
    }
}
