'use client';

import * as React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={`border-b transition-colors hover:bg-gray-800 data-[state=selected]:bg-gray-800 ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={`h-12 px-4 text-left align-middle font-medium text-gray-400 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    >
      {children}
    </th>
  )
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 text-white ${className}`}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = 'TableCell';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
};