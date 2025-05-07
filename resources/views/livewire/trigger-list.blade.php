<div>
        <div class="container mx-auto py-8">
            <h1 class="text-2xl font-bold mb-4">Post Triggers</h1>

            <a href="{{ route('admin.triggers.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">Create New Trigger</a>

            <table class="table-auto w-full">
                <thead class="bg-gray-200 text-gray-700 uppercase font-bold">
                    <tr>
                        <th class="px-4 py-2">ID</th>
                        <th class="px-4 py-2">Instagram Post ID</th>
                        <th class="px-4 py-2">Keyword</th>
                        <th class="px-4 py-2">DM Message</th>
                        <th class="px-4 py-2">Is Active</th>
                        <th class="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    @foreach ($triggers as $trigger)
                        <tr wire:key="{{ $trigger->id }}">
                            <td class="border px-4 py-2">{{ $trigger->id }}</td>
                            <td class="border px-4 py-2">{{ $trigger->instagram_post_id }}</td>
                            <td class="border px-4 py-2">{{ $trigger->keyword }}</td>
                            <td class="border px-4 py-2">{{ $trigger->dm_message }}</td>
                            <td class="border px-4 py-2">{{ $trigger->is_active ? 'Yes' : 'No' }}</td>
                            <td>
                                <a href="{{ route('admin.triggers.edit', $trigger->id) }}">Edit</a>
                                <button wire:click="deleteTrigger({{ $trigger->id }})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            {{ $triggers->links() }}
        </div>
</div>
