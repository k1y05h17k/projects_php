<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // TODO: validar credenciais e emitir JWT (fase Segurança)
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function me(Request $request)
    {
        // TODO: retornar usuário autenticado a partir do token (fase Segurança)
        return response()->json(['message' => 'Not implemented'], 501);
    }
}
