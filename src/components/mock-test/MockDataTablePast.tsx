import { useState, useMemo } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axiosInstance";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  onPageChange?: (page: number) => void;
}

export function MockDataTablePast<TData, TValue>({
  columns,
  data: initialData,
  pagination: serverPagination,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const pageSize = serverPagination?.limit ?? 10;
  const currentPage = serverPagination?.page ?? 1;

  // Generate month options (last 12 months)
  const monthOptions = useMemo(() => {
    const options = [{ value: "all", label: "All Months" }];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      options.push({ value, label });
    }

    return options;
  }, []);

  // Filter data based on selected month
  const filteredData = useMemo(() => {
    if (selectedMonth === "all") return initialData;

    return initialData.filter((row: any) => {
      if (!row.mockTestDate) return false;
      const rowMonth = row.mockTestDate.substring(0, 7); // Extract YYYY-MM
      return rowMonth === selectedMonth;
    });
  }, [initialData, selectedMonth]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData;

    const sorted = [...filteredData];
    sorting.forEach((sort) => {
      const { id, desc } = sort;
      sorted.sort((a: any, b: any) => {
        const aValue = a[id];
        const bValue = b[id];

        // Handle null/undefined values
        if (aValue == null) return desc ? -1 : 1;
        if (bValue == null) return desc ? 1 : -1;

        // Handle string comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          return desc
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        // Handle array (modulesCompleted)
        if (Array.isArray(aValue) && Array.isArray(bValue)) {
          return desc
            ? bValue.length - aValue.length
            : aValue.length - bValue.length;
        }

        // Handle numeric comparison
        return desc ? bValue - aValue : aValue - bValue;
      });
    });
    return sorted;
  }, [filteredData, sorting]);

  // Reset to first page when filter changes
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    if (onPageChange) {
      onPageChange(1);
    }
  };

  // Total pages from server
  const totalPages = serverPagination?.totalPages ?? 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
      let end = start + maxVisiblePages;

      if (end > totalPages) {
        end = totalPages;
        start = Math.max(0, end - maxVisiblePages);
      }

      for (let i = start; i < end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handleExportToExcel = async () => {
    try {
      const res = await api.get("/api/mock-test/past/export",{
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));//wrap the backend response by blob
      const link = document.createElement("a"); // creating invisible a tag
      link.href = url; //href open blob url
      link.setAttribute("download", "past_mock_test_students.xlsx"); // type download and file name
      document.body.appendChild(link); // yo chai birsiye
      link.click(); // invisible link open directly by js
      link.parentNode?.removeChild(link);// link clicked now remove the a tag
      window.URL.revokeObjectURL(url); // cleaning ram prevent memory leak

      toast.success("Exported successfully");
    } catch (error) {
      console.log("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const table = useReactTable({
    data: sortedData,
    columns,
    manualSorting: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Calculate display values
  const startItem =
    sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(
    currentPage * pageSize,
    serverPagination?.total ?? sortedData.length
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold border-b pb-2 mt-6 mb-4">
          Past Mock Test Students
        </h2>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleExportToExcel}
            disabled={filteredData.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-primary hover:bg-primary/95"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-white font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing
            <span className="font-medium">{startItem}</span>
            to
            <span className="font-medium">{endItem}</span>
            of
            <span className="font-medium">
              {serverPagination?.total ?? sortedData.length}
            </span>
            results
            {selectedMonth !== "all" && (
              <span className="text-xs text-gray-500 ml-2">
                (Filtered by month)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange && onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange && onPageChange(Math.max(currentPage - 1, 1))
              }
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange && onPageChange(pageNum + 1)}
                  className="h-8 w-8 p-0"
                >
                  {pageNum + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange &&
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange && onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
