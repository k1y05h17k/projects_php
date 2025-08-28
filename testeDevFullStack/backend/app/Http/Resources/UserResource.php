<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        // Funciona com arrays (stub) e com models depois (Eloquent)
        return [
            'id'    => $this['id']    ?? $this->id     ?? null,
            'name'  => $this['name']  ?? $this->name   ?? null,
            'email' => $this['email'] ?? $this->email  ?? null,
        ];
    }
}
