import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrorQueue();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Error Queue</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Error Message</TableHeader>
            <TableHeader>Action</TableHeader>
            <TableHeader>Details</TableHeader>
            <TableHeader>Timestamp</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {errorQueue.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.errorMessage}</TableCell>
              <TableCell>{item.action}</TableCell>
              <TableCell>{item.details}</TableCell>
              <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeadLetterQueuePage;