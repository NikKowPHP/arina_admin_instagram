@extends('layouts.admin')

@section('content')
<div>
    <h1>Edit Trigger</h1>

    @if (session()->has('message'))
        <div class="alert alert-success">
            {{ session('message') }}
        </div>
    @endif

    <form wire:submit.prevent="updateForm">
        <div>
            <label for="instagram_post_id">Instagram Post ID:</label>
            <input type="text" id="instagram_post_id" wire:model="instagram_post_id">
            @error('instagram_post_id') <span>{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="keyword">Keyword:</label>
            <input type="text" id="keyword" wire:model="keyword">
            @error('keyword') <span>{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="dm_message">DM Message:</label>
            <textarea id="dm_message" wire:model="dm_message"></textarea>
            @error('dm_message') <span>{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="is_active">Is Active:</label>
            <input type="checkbox" id="is_active" wire:model="is_active">
        </div>

        <button type="submit">Update Trigger</button>
    </form>
</div>
@endsection
