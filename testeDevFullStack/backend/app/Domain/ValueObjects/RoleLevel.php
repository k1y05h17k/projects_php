<?php

namespace App\Domain\ValueObjects;

final class RoleLevel
{
    public const ADMIN = 1;
    public const MODERATOR = 2;
    public const READER = 3;

    public function __construct(public int $value)
    {
        if (!in_array($value, [1,2,3], true)) {
            throw new \InvalidArgumentException('Invalid role level');
        }
    }

    public function isAdmin(): bool { return $this->value === self::ADMIN; }
    public function isModerator(): bool { return $this->value === self::MODERATOR; }
    public function isReader(): bool { return $this->value === self::READER; }
}