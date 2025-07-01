import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Admin Panel</h1>
      <p className="text-lg text-gray-400 mb-8">Manage your Instagram bot triggers and analytics.</p>
      <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-colors">
        Go to Dashboard
      </Link>
    </div>
  );
}
