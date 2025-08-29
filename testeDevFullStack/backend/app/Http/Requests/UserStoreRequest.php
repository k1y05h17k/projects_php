<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:120'],
            'email'       => ['required', 'email', 'max:160', 'unique:users,email'],
            'password'    => ['required', 'string', 'min:6'],
            'role_level'  => ['nullable', 'integer', 'in:1,2,3'], // só admin poderá efetivar
        ];
    }
}
