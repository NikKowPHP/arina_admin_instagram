import React from 'react';

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="bg-white">{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b transition duration-300 ease-in-out hover:bg-gray-100">{children}</tr>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{children}</th>;
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 whitespace-nowrap">{children}</td>;
}