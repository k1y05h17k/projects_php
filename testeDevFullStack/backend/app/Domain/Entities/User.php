<?php


namespace App\Domain\Entities;

use App\Domain\ValueObjects\RoleLevel;


class User
{
    public function __construct(
        public readonly string $id,
        public string $name,
        public string $email,
        public string $passwordHash,
        public RoleLevel $roleLevel,
        public readonly \DateTimeImmutable $createdAt,
        public \DateTimeImmutable $updatedAt,
    ) {
        // Invariantes básicas
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email');
        }
        if (!$this->roleLevel->isValid()) {
            throw new \InvalidArgumentException('Invalid role level');
        }
    }
}
