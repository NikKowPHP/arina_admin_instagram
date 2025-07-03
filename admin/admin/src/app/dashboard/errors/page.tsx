'use client';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';

interface DeadLetterQueueItem {
  id: string;
  errorMessage: string;
  action: string;
  details: string;
  timestamp: Date;
}

const DeadLetterQueuePage = () => {
  const [errorQueue, setErrorQueue] = useState<DeadLetterQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchErrorQueue = async () => {
      try {
        const response = await fetch('/api/errors');
        if (!response.ok) {
          throw new Error('Failed to fetch error queue');
        }
        const data = await response.json();
        setErrorQueue(data);
      } catch (error) {
        console.error('Error fetching error queue:', error);
        setError('Failed to load error queue. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrorQueue();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p className="text-lg">Loading error queue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 mt-16">
      <h1 className="text-3xl font-bold text-white mb-6">Error Queue</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Error Message</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {errorQueue.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.errorMessage}</TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell><pre className="whitespace-pre-wrap break-all">{item.details}</pre></TableCell>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeadLetterQueuePage;