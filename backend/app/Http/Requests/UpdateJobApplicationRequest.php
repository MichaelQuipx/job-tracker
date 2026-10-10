<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateJobApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'required', 'string', 'max:255'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'job_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'status' => ['sometimes', 'required', 'in:applied,interview,offer,rejected'],
            'applied_date' => ['sometimes', 'required', 'date'],
            'interview_date' => ['sometimes', 'nullable', 'date'],
            'salary' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
