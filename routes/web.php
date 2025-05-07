<?php

use Illuminate\Support\Facades\Route;
use App\Models\PostTrigger;

Auth::routes();

Route::get('/home', function () {
    return redirect('/admin/triggers');
});

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/triggers', function () { return view('admin.triggers.index'); })->name('triggers.index');
    Route::get('/triggers/create', function () { return view('admin.triggers.create'); })->name('triggers.create');
    Route::get('/triggers/{trigger}/edit', function (PostTrigger $trigger) { return view('admin.triggers.edit', compact('trigger')); })->name('triggers.edit');
});
