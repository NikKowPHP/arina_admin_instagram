import * as React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <table
      ref={ref}
      className={`w-full caption-bottom text-sm ${className}`}
      {...props}
    >
      {children}
    </table>
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={className} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr ref={ref} className={className} {...props}>
      {children}
    </tr>
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => (
    <th ref={ref} className={className} {...props}>
      {children}
    </th>
  )
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td ref={ref} className={className} {...props}>
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