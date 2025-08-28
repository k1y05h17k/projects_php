<?php

namespace App\Repositories;

class InMemoryUserRepository implements UserRepositoryInterface
{
    private array $items = [
        ['id' => '1', 'name' => 'Alice', 'email' => 'alice@example.com'],
        ['id' => '2', 'name' => 'Bob',   'email' => 'bob@example.com'],
    ];

    public function list(array $filters = []): array
    {
        $result = $this->items;
        if (!empty($filters['q'])) {
            $q = mb_strtolower($filters['q']);
            $result = array_values(array_filter($result, function ($u) use ($q) {
                return str_contains(mb_strtolower($u['name']), $q)
                    || str_contains(mb_strtolower($u['email']), $q);
            }));
        }
        return $result;
    }

    public function getById(string $id): ?array
    {
        foreach ($this->items as $u) {
            if ($u['id'] === $id) return $u;
        }
        return null;
    }

    public function create(array $data): array
    {
        $nextId = (string) (count($this->items) + 1);
        $data['id'] = $nextId;
        $this->items[] = $data;
        return $data;
    }

    public function update(string $id, array $data): ?array
    {
        foreach ($this->items as &$u) {
            if ($u['id'] === $id) {
                $u = array_merge($u, $data);
                return $u;
            }
        }
        return null;
    }

    public function delete(string $id): bool
    {
        $before = count($this->items);
        $this->items = array_values(array_filter($this->items, fn ($u) => $u['id'] !== $id));
        return count($this->items) < $before;
    }
}
