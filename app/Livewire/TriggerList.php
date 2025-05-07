<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\PostTrigger;

class TriggerList extends Component
{
    public $triggers;

    public function mount()
    {
        $this->triggers = PostTrigger::all();
    }

    public function deleteTrigger($triggerId)
    {
        PostTrigger::find($triggerId)->delete();
        $this->triggers = PostTrigger::all();
    }

    public function render()
    {
        return view('livewire.trigger-list');
    }
}
