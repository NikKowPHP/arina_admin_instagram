import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
        './app/Livewire/**/*.php', // Add path for Livewire components
        './app/View/Components/**/*.php', // Add path for Blade components
    ],

    theme: {
        extend: {
            fontFamily: {
                // Match the font defined in resources/css/app.css and welcome.blade.php
                sans: ['Instrument Sans', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [],
};