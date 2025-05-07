<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\PostTrigger;
use Livewire\Attributes\Validate;
use Illuminate\Support\Facades\Redirect;

class EditTrigger extends Component
{
    public $triggerId;

    #[Validate('required|string')]
    public $instagram_post_id = '';

    #[Validate('required|string')]
    public $keyword = '';

    #[Validate('nullable|url')]
    public $media_url = '';

    #[Validate('nullable|string')]
    public $media_type = ''; // e.g., 'image', 'video'

    #[Validate('nullable|string')]
    public $description_text = '';

    #[Validate('nullable|string')]
    public $cta_text = '';

    #[Validate('nullable|url')]
    public $cta_url = '';

    public $is_active = true;

    public function mount($triggerId)
    {
        $this->triggerId = $triggerId;
        $trigger = PostTrigger::find($triggerId);
        $this->instagram_post_id = $trigger->instagram_post_id;
        $this->keyword = $trigger->keyword;
        $this->is_active = $trigger->is_active;

        // Parse dm_message if it's an array
        if (is_array($trigger->dm_message)) {
            $this->media_url = $trigger->dm_message['media_url'] ?? '';
            $this->media_type = $trigger->dm_message['media_type'] ?? '';
            $this->description_text = $trigger->dm_message['description_text'] ?? '';
            $this->cta_text = $trigger->dm_message['cta_text'] ?? '';
            $this->cta_url = $trigger->dm_message['cta_url'] ?? '';
        } else {
            // Handle cases where dm_message is not an array (e.g., old data)
            $this->description_text = $trigger->dm_message ?? '';
        }
    }

    public function updateForm()
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

        $trigger = PostTrigger::find($this->triggerId);
        $trigger->instagram_post_id = $this->instagram_post_id;
        $trigger->keyword = $this->keyword;
        $trigger->dm_message = $this->dm_message; // Store the array
        $trigger->is_active = $this->is_active;
        $trigger->save();

        session()->flash('message', 'Trigger Updated Successfully.');

        return Redirect::to('/admin/triggers');
    }

    public function render()
    {
        return view('livewire.edit-trigger');
    }
}
