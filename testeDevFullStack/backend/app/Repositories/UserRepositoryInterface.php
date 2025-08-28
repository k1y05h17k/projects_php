<?php

namespace App\Repositories;

interface UserRepositoryInterface
{
    public function list(array $filters = []): array;
    public function getById(string $id): ?array;
    public function create(array $data): array;
    public function update(string $id, array $data): ?array;
    public function delete(string $id): bool;
}
