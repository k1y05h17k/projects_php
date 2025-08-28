<?php

namespace App\Domain\Entities;

use App\Domain\ValueObjects\RoleLevel;

final class User
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $email,
        public string $passwordHash,
        public RoleLevel $roleLevel,
        public ?\DateTimeImmutable $createdAt = null,
        public ?\DateTimeImmutable $updatedAt = null,
    ) {}

    public static function new(string $name, string $email, string $passwordHash, RoleLevel $roleLevel): self
    {
        return new self(null, $name, $email, $passwordHash, $roleLevel);
    }

    public function changeRole(RoleLevel $newRole): void
    {
        $this->roleLevel = $newRole;
    }

    public function rename(string $name): void
    {
        $this->name = $name;
    }

    public function rehashPassword(string $passwordHash): void
    {
        $this->passwordHash = $passwordHash;
    }
}