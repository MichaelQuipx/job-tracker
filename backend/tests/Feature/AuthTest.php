<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_a_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'token',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    }
    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('CorrectPassword123!'),
        ]);

        $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'WrongPassword123!',
        ])->assertUnprocessable();
    }
}
