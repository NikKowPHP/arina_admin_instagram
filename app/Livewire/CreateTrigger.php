<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\PostTrigger;
use Livewire\Attributes\Validate;
use Illuminate\Support\Facades\Redirect;

class CreateTrigger extends Component
{
    #[Validate('required|string')]
    public $instagram_post_id = '';

    #[Validate('required|string')]
    public $keyword = '';

    #[Validate('required|string')]
    public $dm_message = '';

    public $is_active = true;

    public function submitForm()
    {
        $this->validate();

        PostTrigger::create([
            'instagram_post_id' => $this->instagram_post_id,
            'keyword' => $this->keyword,
            'dm_message' => $this->dm_message,
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
