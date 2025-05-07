@extends('layouts.app')

@section('content')
<div class="mx-auto px-4 py-8">
    <div class="flex justify-center">
        <div class="w-full md:w-2/3">
            <div class="border rounded shadow bg-white">
                <div class="px-6 py-4 border-b text-lg font-semibold">{{ __('Login') }}</div>

                <div class="p-6">
                    <form method="POST" action="{{ route('login') }}">
                        @csrf

                        <div class="flex flex-wrap mb-4">
                            <label for="email" class="md:w-1/3 md:text-right pr-4 pl-0 py-2">{{ __('Email Address') }}</label>

                            <div class="md:w-2/3">
                                <input id="email" type="email" class="border rounded px-3 py-2 w-full @error('email') border-red-500 @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                @error('email')
                                    <span class="text-red-500 text-sm mt-1" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="flex flex-wrap mb-4">
                            <label for="password" class="md:w-1/3 md:text-right pr-4 pl-0 py-2">{{ __('Password') }}</label>

                            <div class="md:w-2/3">
                                <input id="password" type="password" class="border rounded px-3 py-2 w-full @error('password') border-red-500 @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                    <span class="text-red-500 text-sm mt-1" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="flex flex-wrap mb-4">
                            <div class="md:w-2/3 md:ml-1/3">
                                <div class="flex items-center">
                                    <input class="mr-2 leading-tight" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                    <label class="text-gray-700" for="remember">
                                        {{ __('Remember Me') }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap mb-0">
                            <div class="md:w-2/3 md:ml-1/3">
                                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    {{ __('Login') }}
                                </button>

                                @if (Route::has('password.request'))
                                    <a class="text-blue-500 hover:text-blue-700 ml-4" href="{{ route('password.request') }}">
                                        {{ __('Forgot Your Password?') }}
                                    </a>
                                @endif
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
