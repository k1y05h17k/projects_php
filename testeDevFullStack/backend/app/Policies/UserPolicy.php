<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        // Todos os perfis podem listar
        return true;
    }

    public function view(User $user, User $target): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role_level === 1; // admin
    }

    public function update(User $user, User $target): bool
    {
        // admin ou moderador
        return in_array($user->role_level, [1,2], true);
    }

    public function delete(User $user, User $target): bool
    {
        // só admin e não pode deletar a si mesmo
        return $user->role_level === 1 && $user->id !== $target->id;
    }
}
