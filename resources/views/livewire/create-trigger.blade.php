@extends('layouts.admin')

@section('content')
<div>
    <h1>Create Trigger</h1>

    @if (session()->has('message'))
        <div class="alert alert-success">
            {{ session('message') }}
        </div>
    @endif

    <form wire:submit.prevent="submitForm">
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
            <label for="media_url">Media URL:</label>
            <input type="text" id="media_url" wire:model="media_url">
            @error('media_url') <span>{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="media_type">Media Type:</label>
            <input type="text" id="media_type" wire:model="media_type"> {{-- Consider a dropdown later --}}
            @error('media_type') <span>{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="description_text">Description Text:</label>
            <textarea id="description_text" wire:model="description_text"></textarea>
            @error('description_text') <span>{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="cta_text">CTA Text:</label>
            <input type="text" id="cta_text" wire:model="cta_text">
            @error('cta_text') <span>{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="cta_url">CTA URL:</label>
            <input type="text" id="cta_url" wire:model="cta_url">
            @error('cta_url') <span>{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="is_active">Is Active:</label>
            <input type="checkbox" id="is_active" wire:model="is_active">
        </div>

        <button type="submit">Create Trigger</button>
    </form>
</div>
@endsection
