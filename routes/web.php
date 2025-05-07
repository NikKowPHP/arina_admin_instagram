<?php

use Illuminate\Support\Facades\Route;
use App\Http\Livewire\TriggerList;
use App\Http\Livewire\CreateTrigger;
use App\Http\Livewire\EditTrigger;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/triggers', TriggerList::class)->name('admin.triggers.index');
Route::get('/admin/triggers/create', CreateTrigger::class)->name('admin.triggers.create');
Route::get('/admin/triggers/{trigger}/edit', EditTrigger::class)->name('admin.triggers.edit');
