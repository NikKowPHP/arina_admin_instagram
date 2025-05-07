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

    #[Validate('required|string')]
    public $dm_message = '';

    public $is_active = true;

    public function mount($triggerId)
    {
        $this->triggerId = $triggerId;
        $trigger = PostTrigger::find($triggerId);
        $this->instagram_post_id = $trigger->instagram_post_id;
        $this->keyword = $trigger->keyword;
        $this->dm_message = $trigger->dm_message;
        $this->is_active = $trigger->is_active;
    }

    public function updateForm()
    {
        $this->validate();

        $trigger = PostTrigger::find($this->triggerId);
        $trigger->instagram_post_id = $this->instagram_post_id;
        $trigger->keyword = $this->keyword;
        $trigger->dm_message = $this->dm_message;
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
