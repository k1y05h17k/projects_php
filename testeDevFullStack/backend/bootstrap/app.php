<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // mantenha o que já tiver aqui
    })
    ->withExceptions(function (Exceptions $exceptions) {

        // 422 - Validação
        $exceptions->renderable(function (ValidationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        // 401 - Não autenticado
        $exceptions->renderable(function (AuthenticationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
        });

        // 403 - Sem permissão
        $exceptions->renderable(function (AuthorizationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        });

        // 404 - Não encontrado
        $exceptions->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Not found'], 404);
            }
        });

        // 405 - Método não permitido
        $exceptions->renderable(function (MethodNotAllowedHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Method not allowed'], 405);
            }
        });

        // 429 - Limite de requisições
        $exceptions->renderable(function (TooManyRequestsHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Too many requests'], 429);
            }
        });

        // Fallback — garante JSON para qualquer outra exceção
        $exceptions->renderable(function (Throwable $e, $request) {
            if ($request->expectsJson()) {
                $status = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;
                $message = $status === 500 ? 'Internal server error' : ($e->getMessage() ?: 'Error');
                return response()->json(['message' => $message], $status);
            }
        });

    })
    ->create();
