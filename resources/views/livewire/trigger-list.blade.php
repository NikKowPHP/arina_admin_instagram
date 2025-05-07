@extends('layouts.admin')

@section('content')
<div>
    <h1>Post Triggers</h1>

    <a href="{{ route('admin.triggers.create') }}">Create New Trigger</a>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Instagram Post ID</th>
                <th>Keyword</th>
                <th>DM Message</th>
                <th>Is Active</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($triggers as $trigger)
                <tr>
                    <td>{{ $trigger->id }}</td>
                    <td>{{ $trigger->instagram_post_id }}</td>
                    <td>{{ $trigger->keyword }}</td>
                    <td>{{ $trigger->dm_message }}</td>
                    <td>{{ $trigger->is_active ? 'Yes' : 'No' }}</td>
                    <td>
                        <a href="{{ route('admin.triggers.edit', $trigger->id) }}">Edit</a>
                        <button wire:click="deleteTrigger({{ $trigger->id }})">Delete</button>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
