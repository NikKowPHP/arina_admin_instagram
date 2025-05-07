<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\PostTrigger;

class TriggerList extends Component
{
    use WithPagination;

    public function deleteTrigger($triggerId)
    {
        PostTrigger::find($triggerId)->delete();
    }

    public function render()
    {
        $triggers = PostTrigger::latest()->paginate(15);
        return view('livewire.trigger-list', ['triggers' => $triggers]);
    }
}
