<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private UserService $service) {}

    /**
     * GET /api/users
     */
    public function index(Request $request)
    {
        // Policy
        $this->authorize('viewAny', User::class);

        // Se preferir via service, mantenha. Aqui garantimos apenas campos públicos.
        $users = User::query()
            ->select(['id', 'name', 'email', 'role_level', 'created_at', 'updated_at'])
            ->orderBy('id')
            ->get();

        return UserResource::collection($users);
    }

    /**
     * GET /api/users/{id}
     */
    public function show(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $this->authorize('view', $user);

        return new UserResource($user);
    }

    /**
     * POST /api/users
     */
    public function store(UserStoreRequest $request)
    {
        $this->authorize('create', User::class);

        try {
            // service pode retornar array; após criar buscamos o Model
            $created = $this->service->create($request->validated());

            // tenta descobrir o ID retornado (array ou model)
            $id = is_array($created) ? ($created['id'] ?? null) : (method_exists($created, 'getKey') ? $created->getKey() : null);

            $model = $id ? User::find($id) : null;
            if (!$model) {
                // fallback: última criação por email (não ideal, mas evita 500 caso repo retorne algo sem id)
                $email = $request->validated('email');
                $model = $email ? User::where('email', $email)->first() : null;
            }

            return (new UserResource($model ?: new User()))->response()->setStatusCode(201);
        } catch (QueryException $e) {
            $sql = $e->errorInfo[0] ?? null;
            $code = $e->errorInfo[1] ?? null;
            if ($sql === '23000' || in_array($code, [2067, 1062, 23505], true)) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => ['email' => ['The email has already been taken.']],
                ], 422);
            }
            throw $e;
        }
    }

    /**
     * PUT /api/users/{id}
     */
    public function update(UserUpdateRequest $request, string $id)
    {
        $target = User::find($id);
        if (!$target) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $this->authorize('update', $target);

        try {
            $updated = $this->service->update($id, $request->validated());

            // garanta que vamos responder com o Model
            $model = User::find($id);
            if (!$model) {
                return response()->json(['message' => 'User not found'], 404);
            }

            return new UserResource($model);
        } catch (QueryException $e) {
            $sqlState   = $e->errorInfo[0] ?? null;
            $driverCode = $e->errorInfo[1] ?? null;
            if ($sqlState === '23000' || in_array($driverCode, [2067, 1062, 23505], true)) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => ['email' => ['The email has already been taken.']],
                ], 422);
            }
            throw $e;
        }
    }

    /**
     * DELETE /api/users/{id}
     */
    public function destroy(string $id)
    {
        $target = User::find($id);
        if (!$target) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $this->authorize('delete', $target);

        $deleted = $this->service->delete($id);
        if (!$deleted) {
            // Ex.: tentativa de auto-exclusão barrada no service
            return response()->json(['message' => 'Unable to delete user'], 422);
        }

        return response()->noContent(); // 204
    }
}
