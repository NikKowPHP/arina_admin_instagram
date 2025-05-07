@extends('layouts.app')

@section('content')
<div class="mx-auto px-4 py-8">
    <div class="flex justify-center">
        <div class="w-full md:w-2/3">
            <div class="border rounded shadow bg-white">
                <div class="px-6 py-4 border-b text-lg font-semibold">{{ __('Verify Your Email Address') }}</div>

                <div class="p-6">
                    @if (session('resent'))
                        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            {{ __('A fresh verification link has been sent to your email address.') }}
                        </div>
                    @endif

                    {{ __('Before proceeding, please check your email for a verification link.') }}
                    {{ __('If you did not receive the email') }},
                    <form class="inline" method="POST" action="{{ route('verification.resend') }}">
                        @csrf
                        <button type="submit" class="text-blue-500 hover:text-blue-700 p-0 m-0 align-baseline">{{ __('click here to request another') }}</button>.
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
