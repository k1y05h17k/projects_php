<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
public function run(): void
{
    \App\Models\User::updateOrCreate(
        ['email' => 'admin@example.com'],
        ['name' => 'Admin', 'password' => bcrypt('admin123'), 'role_level' => \App\Models\User::ROLE_ADMIN]
    );

    \App\Models\User::updateOrCreate(
        ['email' => 'moderator@example.com'],
        ['name' => 'Moderator', 'password' => bcrypt('moderator123'), 'role_level' => \App\Models\User::ROLE_MODERATOR]
    );

    \App\Models\User::updateOrCreate(
        ['email' => 'reader@example.com'],
        ['name' => 'Reader', 'password' => bcrypt('reader123'), 'role_level' => \App\Models\User::ROLE_READER]
    );
}

}
