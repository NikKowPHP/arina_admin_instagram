import React from 'react';

export interface TableProps {
  children: React.ReactNode;
}

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface TableRowProps {
  children: React.ReactNode;
}

export interface TableHeadProps {
  children: React.ReactNode;
}

export interface TableCellProps {
  children: React.ReactNode;
}

declare const Table: React.FC<TableProps>;
declare const TableHeader: React.FC<TableHeaderProps>;
declare const TableBody: React.FC<TableBodyProps>;
declare const TableRow: React.FC<TableRowProps>;
declare const TableHead: React.FC<TableHeadProps>;
declare const TableCell: React.FC<TableCellProps>;

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };