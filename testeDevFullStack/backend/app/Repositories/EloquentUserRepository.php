<?php

namespace App\Repositories;

use App\Models\User;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function list(array $filters = []): array
    {
        $q = User::query();

        if (!empty($filters['q'])) {
            $q->where(function ($qq) use ($filters) {
                $qq->where('name', 'like', '%' . $filters['q'] . '%')
                   ->orWhere('email', 'like', '%' . $filters['q'] . '%');
            });
        }

        return $q->get()->toArray();
    }

    public function getById(string $id): ?array
    {
        return User::find($id)?->toArray();
    }

    public function create(array $data): array
    {
        $data['password'] = bcrypt($data['password']);
        return User::create($data)->toArray();
    }

    public function update(string $id, array $data): ?array
    {
        $user = User::find($id);
        if (!$user) return null;

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $user->update($data);
        return $user->toArray();
    }

    public function delete(string $id): bool
    {
        $user = User::find($id);
        if (!$user) return false;

        return (bool) $user->delete();
    }
}
