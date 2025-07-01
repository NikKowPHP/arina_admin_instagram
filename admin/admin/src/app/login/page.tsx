'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase-provider';
import { Button } from '@/components/ui/button';

// ROO-AUDIT-TAG :: plan-004-admin-authentication.md :: Implement admin authentication
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const supabase = useSupabase();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-sm border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
// ROO-AUDIT-TAG :: plan-004-admin-authentication.md :: END
}