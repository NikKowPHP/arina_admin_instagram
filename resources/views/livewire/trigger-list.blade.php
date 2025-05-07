<div>
        <div class="container mx-auto py-8">
            <h1 class="text-2xl font-bold mb-4">Post Triggers</h1>

            <a href="{{ route('admin.triggers.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">Create New Trigger</a>

            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                        <th class="py-3 px-6 text-left">ID</th>
                        <th class="py-3 px-6 text-left">Instagram Post ID</th>
                        <th class="py-3 px-6 text-left">Keyword</th>
                        <th class="py-3 px-6 text-left">DM Message</th>
                        <th class="py-3 px-6 text-left">Is Active</th>
                        <th class="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                    @foreach ($triggers as $trigger)
                        <tr wire:key="{{ $trigger->id }}" class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6 text-left whitespace-nowrap">{{ $trigger->id }}</td>
                            <td class="py-3 px-6 text-left">{{ $trigger->instagram_post_id }}</td>
                            <td class="py-3 px-6 text-left">{{ $trigger->keyword }}</td>
                            <td class="py-3 px-6 text-left">{{ $trigger->dm_message }}</td>
                            <td class="py-3 px-6 text-left">{{ $trigger->is_active ? 'Yes' : 'No' }}</td>
                            <td class="py-3 px-6 text-center">
                                <a href="{{ route('admin.triggers.edit', $trigger->id) }}" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                                <button wire:click="deleteTrigger({{ $trigger->id }})" class="bg-red-600 hover:bg-red-900 text-white py-1 px-2 rounded text-xs">Delete</button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="mt-4">
                {{ $triggers->links() }}
            </div>
        </div>
</div>
