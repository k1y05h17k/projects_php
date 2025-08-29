<?php

return [

    // ==== Defaults ====
    'defaults' => [
        'guard' => env('AUTH_GUARD', 'api'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    // ==== Guards ====
    'guards' => [
        // Guard JWT para a API
        'api' => [
            'driver'   => 'jwt',           
            'provider' => 'users',
        ],

        // Guard web (sessão) — mantenha para futura área administrativa se quiser
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],
    ],

    // ==== Providers ====
    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model'  => env('AUTH_MODEL', App\Models\User::class),
        ],
        // 'users' => ['driver' => 'database', 'table' => 'users'],
    ],

    // ==== Password Resets ====
    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table'    => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire'   => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),
];
