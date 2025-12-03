import type { ColumnDef } from '@tanstack/react-table';
import DashboardTable from './DashboardTable';
import { useMemo, useState } from 'react';
import type { PresentStudent } from '@/lib/api/dashboard';
import { useTodayPresentStudents } from '@/lib/api/dashboard';

type Props = { selectedDate?: Date };

export default function TodayPresentTable({ selectedDate }: Props) {
  const { data = [], isLoading, error, isError } = useTodayPresentStudents(selectedDate);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing page size
  };

  const columns = useMemo<ColumnDef<PresentStudent>[]>(
    () => [
      { accessorKey: 'fullName', header: 'Full Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phoneNumber', header: 'Phone' },
      { accessorKey: 'language', header: 'Language' },
      { accessorKey: 'status', header: 'Status' },
    ],
    []
  );

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageRows = data.slice(start, end);

  const emptyFallback = !isLoading && total === 0;

  if (isError) {
    return (
      <div className="w-full p-4 text-center text-red-600">
        Error loading data: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="w-full">
      <DashboardTable
        columns={columns}
        data={pageRows}
        pagination={{ page, limit, total, totalPages }}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
        emptyMessage={emptyFallback ? 'No one is Present' : undefined}
      />
    </div>
  );
}
