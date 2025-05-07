<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="bg-gray-100 h-screen">
    <nav class="bg-gray-800 text-white p-4 flex items-center justify-between">
        <a href="{{ route('admin.triggers.index') }}" class="text-white hover:text-gray-300">Triggers</a>
        <form method="POST" action="{{ route('logout') }}" class="ml-4">
            @csrf
            <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
        </form>
    </nav>

    <div>
        @yield('content')
    </div>

    @livewireScripts
</body>
</html>
