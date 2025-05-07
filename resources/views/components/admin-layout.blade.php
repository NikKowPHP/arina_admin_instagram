<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    @livewireStyles
</head>
<body class="bg-gray-100 min-h-screen">
    <nav class="bg-white shadow-md p-4 flex items-center justify-between">
        <a href="{{ route('admin.triggers.index') }}" class="text-blue-600 hover:text-blue-800 font-semibold">Triggers</a>
        <form method="POST" action="{{ route('logout') }}" class="ml-4">
            @csrf
            <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
        </form>
    </nav>

    <div class="p-6">
        {{ $slot }}
    </div>

    @livewireScripts
</body>
</html>
