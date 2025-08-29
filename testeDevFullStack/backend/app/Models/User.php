<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    // níveis
    public const ROLE_ADMIN     = 1;
    public const ROLE_MODERATOR = 2;
    public const ROLE_READER    = 3;


    protected $fillable = ['name','email','password','role_level'];
    protected $hidden   = ['password'];

  // JWT
    public function getJWTIdentifier(): mixed { return $this->getKey(); }
    public function getJWTCustomClaims(): array { return ['role_level' => $this->role_level]; }

    // helpers
    public function isAdmin(): bool     { return (int)$this->role_level === self::ROLE_ADMIN; }
    public function isModerator(): bool { return (int)$this->role_level === self::ROLE_MODERATOR; }
    public function isReader(): bool    { return (int)$this->role_level === self::ROLE_READER; }
}
