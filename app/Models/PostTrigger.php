<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostTrigger extends Model
{
    protected $fillable = [
        'instagram_post_id',
        'keyword',
        'dm_message',
        'is_active',
    ];

    protected $casts = [
        'dm_message' => 'array',
        'is_active' => 'boolean',
    ];
}
