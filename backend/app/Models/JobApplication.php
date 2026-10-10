<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    protected $fillable = [
        'company',
        'position',
        'location',
        'job_url',
        'status',
        'applied_date',
        'interview_date',
        'salary',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'applied_date' => 'date',
            'interview_date' => 'datetime',
            'salary' => 'integer'
        ];
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected $attributes = [
        'status' => 'applied',
    ];
}
