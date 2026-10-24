<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class JobApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_view_another_users_application(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $application = $owner->jobApplications()->create([
            'company' => 'Acme',
            'position' => 'Developer',
            'applied_date' => '2026-10-10',
        ]);

        Sanctum::actingAs($intruder);

        $this->getJson("/api/applications/{$application->id}")->assertForbidden();
    }

    public function test_guest_cannot_list_applications(): void
    {
        $this->getJson('/api/applications')
            ->assertUnauthorized();
    }


    public function test_user_only_sees_their_own_applications(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $user->jobApplications()->create([
            'company' => 'Acme',
            'position' => 'Developer',
            'applied_date' => '2026-10-10',
        ]);

        $other->jobApplications()->create([
            'company' => 'Beta',
            'position' => 'Designer',
            'applied_date' => '2026-10-11',
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/applications')
            ->assertOk()
            ->assertJsonCount(1);
    }


    public function test_user_can_view_their_own_application(): void
    {
        $user = User::factory()->create();

        $application = $user->jobApplications()->create([
            'company' => 'Acme',
            'position' => 'Developer',
            'applied_date' => '2026-10-10',
        ]);

        Sanctum::actingAs($user);

        $this->getJson("/api/applications/{$application->id}")
            ->assertOk();
    }

    public function test_user_cannot_update_another_users_application(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        $application = $owner->jobApplications()->create([
            'company' => 'Acme',
            'position' => 'Developer',
            'applied_date' => '2026-10-10',
        ]);

        Sanctum::actingAs($intruder);

        $this->patchJson("/api/applications/{$application->id}", [
            'company' => 'Hacked Company',
        ])->assertForbidden();

        $this->assertDatabaseHas('job_applications', [
            'id' => $application->id,
            'company' => 'Acme',
        ]);
    }


    public function test_user_cannot_delete_another_users_application(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        $application = $owner->jobApplications()->create([
            'company' => 'Acme',
            'position' => 'Developer',
            'applied_date' => '2026-10-10',
        ]);

        Sanctum::actingAs($intruder);

        $this->deleteJson("/api/applications/{$application->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('job_applications', [
            'id' => $application->id,
        ]);
    }


    public function test_company_is_required_when_creating_an_application(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/applications', [
            'position' => 'Developer',
            'applied_date' => '2026-10-10',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['company']);
    }


    public function test_user_id_from_request_is_ignored(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/applications', [
            'company' => 'Acme',
            'position' => 'Developer',
            'applied_date' => '2026-10-10',
            'user_id' => $other->id,
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('job_applications', [
            'company' => 'Acme',
            'position' => 'Developer',
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseMissing('job_applications', [
            'company' => 'Acme',
            'user_id' => $other->id,
        ]);
    }


    public function test_javascript_url_is_rejected(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/applications', [
            'company' => 'Acme',
            'position' => 'Developer',
            'applied_date' => '2026-10-10',
            'job_url' => 'javascript:alert(1)',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['job_url']);
    }
}
