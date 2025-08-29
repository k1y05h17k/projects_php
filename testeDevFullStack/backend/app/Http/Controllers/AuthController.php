<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if (!$token = Auth::guard('api')->attempt($data)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 60, // em segundos
        ]);
    }

   public function register(Request $request)
{
    $allowRoles = filter_var(config('app.public_registration_allow_roles', env('PUBLIC_REGISTRATION_ALLOW_ROLES', false)), FILTER_VALIDATE_BOOL);
    $regCodeEnv = (string) env('PUBLIC_REGISTRATION_CODE', '');

    // Regra base
    $rules = [
        'name'                  => ['required','string','max:255'],
        'email'                 => ['required','email','max:255', Rule::unique('users','email')],
        'password'              => ['required','string','min:6','confirmed'],
    ];

    // Se estiver permitido escolher role, valide o role_level e (opcionalmente) o código
    if ($allowRoles) {
        $rules['role_level'] = ['nullable','integer','in:1,2,3'];
        // Se quiser exigir código só para 1/2, use sometimes:
        // $rules['registration_code'] = ['required_with:role_level','string'];
        $rules['registration_code'] = ['nullable','string'];
    }

    $data = $request->validate($rules);

    // Default = Leitor
    $role = User::ROLE_READER;

    if ($allowRoles && isset($data['role_level'])) {
        $requested = (int) $data['role_level'];
        // Se informou um código e bate com o .env, aceita o role solicitado;
        // caso contrário, mantém Leitor (3)
        $codeOk = $regCodeEnv === '' || $regCodeEnv === (string) ($data['registration_code'] ?? '');
        if ($codeOk && in_array($requested, [User::ROLE_ADMIN, User::ROLE_MODERATOR, User::ROLE_READER], true)) {
            $role = $requested;
        }
    }

    $user = User::create([
        'name'       => trim($data['name']),
        'email'      => mb_strtolower(trim($data['email'])),
        'password'   => bcrypt($data['password']),
        'role_level' => $role,
    ]);

    // (opção A) já retorna token para auto-login no front
    $token = Auth::login($user);

    return response()->json([
        'access_token' => $token,
        'token_type'   => 'bearer',
        'expires_in'   =>  Auth::factory()->getTTL()* 60,
        'user'         => new \App\Http\Resources\UserResource($user),
    ], 201);
}


    public function me()
    {
        return new UserResource(Auth::user());
    }

    public function logout()
    {
        JWTAuth::logout();
        return response()->json(['message' => 'Logged out']);
    }

    public function refresh()
    {
        return response()->json([
            'access_token' => JWTAuth::refresh(),
            'token_type'   => 'bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 60,
        ]);
    }
}
