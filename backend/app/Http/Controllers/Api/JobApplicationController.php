<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use App\Http\Requests\StoreJobApplicationRequest;
use App\Http\Requests\UpdateJobApplicationRequest;
use Illuminate\Support\Facades\Gate;

class JobApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $applications = $request->user()
            ->jobApplications()
            ->latest('applied_date')
            ->get();

        return response()->json($applications);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobApplicationRequest $request)
    {
        $application = $request->user()
            ->jobApplications()
            ->create($request->validated());

        return response()->json($application->refresh(), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobApplication $application)
    {
        Gate::authorize('view', $application);

        return response()->json($application);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobApplicationRequest $request, JobApplication $application)
    {
        Gate::authorize('update', $application);

        $application->update($request->validated());

        return response()->json($application->refresh());
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(JobApplication $application)
    {
        Gate::authorize('delete', $application);

        $application->delete();

        return response()->noContent();
    }
}
