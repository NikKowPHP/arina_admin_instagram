<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\PostTrigger;
use Livewire\Attributes\Validate;
use Illuminate\Support\Facades\Redirect;

class CreateTrigger extends Component
{
    #[Validate('required|string|max:255')]
    public $instagram_post_id = '';

    #[Validate('required|string|max:255')]
    public $keyword = '';

    #[Validate('nullable|url')]
    public $media_url = '';

    #[Validate('nullable|string|in:image,video')]
    public $media_type = ''; // e.g., 'image', 'video'

    #[Validate('nullable|string')]
    public $description_text = '';

    #[Validate('nullable|string|max:20')]
    public $cta_text = '';

    #[Validate('nullable|url')]
    public $cta_url = '';

    public $is_active = true;

    public function submitForm()
    {
        // Combine rich DM content fields into dm_message array
        $this->dm_message = [
            'media_url' => $this->media_url,
            'media_type' => $this->media_type,
            'description_text' => $this->description_text,
            'cta_text' => $this->cta_text,
            'cta_url' => $this->cta_url,
        ];

        $this->validate([
            'instagram_post_id' => 'required|string',
            'keyword' => 'required|string',
            'dm_message' => 'required|array', // Validate as array
            'is_active' => 'boolean',
            'media_url' => 'nullable|url',
            'media_type' => 'nullable|string',
            'description_text' => 'nullable|string',
            'cta_text' => 'nullable|string',
            'cta_url' => 'nullable|url',
        ]);

        PostTrigger::create([
            'instagram_post_id' => $this->instagram_post_id,
            'keyword' => $this->keyword,
            'dm_message' => $this->dm_message, // Store the array
            'is_active' => $this->is_active,
        ]);

        session()->flash('message', 'Trigger Created Successfully.');

        return Redirect::to('/admin/triggers');
    }

    public function render()
    {
        return view('livewire.create-trigger');
    }
}
