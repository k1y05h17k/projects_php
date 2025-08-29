<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /** @return array<string,mixed> */
    public function toArray(Request $request): array
    {
        // protege caso role_level esteja null em algum registro antigo
        $role = is_null($this->role_level) ? 3 : (int) $this->role_level;

        return [
            'id'         => (int) $this->id,
            'name'       => (string) $this->name,
            'email'      => (string) $this->email,
            'role_level' => $role,
            'created_at' => $this->whenNotNull($this->created_at),
            'updated_at' => $this->whenNotNull($this->updated_at),
        ];
    }
}
