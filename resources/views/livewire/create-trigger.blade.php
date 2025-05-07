<div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Create Trigger</h1>

    @if (session()->has('message'))
        <div class="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
            {{ session('message') }}
        </div>
    @endif

    <form wire:submit.prevent="submitForm" class="max-w-md mx-auto">
        <div class="mb-4">
            <label for="instagram_post_id" class="block text-gray-700 text-sm font-bold mb-2">Instagram Post ID:</label>
            <input type="text" id="instagram_post_id" wire:model="instagram_post_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            @error('instagram_post_id') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="keyword" class="block text-gray-700 text-sm font-bold mb-2">Keyword:</label>
            <input type="text" id="keyword" wire:model="keyword" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            @error('keyword') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="media_url" class="block text-gray-700 text-sm font-bold mb-2">Media URL:</label>
            <input type="text" id="media_url" wire:model="media_url" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            @error('media_url') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="media_type" class="block text-gray-700 text-sm font-bold mb-2">Media Type:</label>
            <input type="text" id="media_type" wire:model="media_type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"> {{-- Consider a dropdown later --}}
            @error('media_type') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="description_text" class="block text-gray-700 text-sm font-bold mb-2">Description Text:</label>
            <textarea id="description_text" wire:model="description_text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            @error('description_text') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="cta_text" class="block text-gray-700 text-sm font-bold mb-2">CTA Text:</label>
            <input type="text" id="cta_text" wire:model="cta_text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            @error('cta_text') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="cta_url" class="block text-gray-700 text-sm font-bold mb-2">CTA URL:</label>
            <input type="text" id="cta_url" wire:model="cta_url" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            @error('cta_url') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
        </div>

        <div class="mb-4">
            <label for="is_active" class="block text-gray-700 text-sm font-bold mb-2">Is Active:</label>
            <input type="checkbox" id="is_active" wire:model="is_active">
        </div>

        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Trigger</button>
    </form>
</div>
