<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'name'        => ['sometimes', 'string', 'max:120'],
            'email'       => ['sometimes', 'email', 'max:160', "unique:users,email,{$id}"],
            'password'    => ['sometimes', 'string', 'min:6'],
            'role_level'  => ['sometimes', 'integer', 'in:1,2,3'], // só admin poderá efetivar
        ];
    }
}
