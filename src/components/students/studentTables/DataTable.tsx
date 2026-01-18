import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Mail, Plus, Search, Share } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useExportMockTests } from "@/lib/api/useMockRegister";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  totalRows?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
  addLink?: string;
  addLabel?: string;
  isMessaging?: boolean;
  isPaymentFilter?: boolean;
  isDateFilter?: boolean;
  isExport?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 1,
  pageIndex: externalPageIndex = 0,
  pageSize: externalPageSize = 10,
  totalRows = 0,
  onPaginationChange,
  addLink,
  isMessaging = false,
  isPaymentFilter = false,
  isExport = false,

  addLabel = "Add Student",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(externalPageIndex);
  const [pageSize, setPageSize] = useState(externalPageSize);
  const pathname = window.location.pathname.split("/").filter(Boolean);
  const isServerSidePagination = !!onPaginationChange;

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const navigate = useNavigate();

  const { mutate: exportData, isPending: isExporting } = useExportMockTests();
  const table = useReactTable({
    data,
    columns,
    pageCount: isServerSidePagination ? pageCount : undefined,
    manualPagination: isServerSidePagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
      pagination: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
  });

  // Update page size handler
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(0); // Reset to first page when changing page size
    table.setPageSize(newSize);
    if (isServerSidePagination && onPaginationChange) {
      onPaginationChange(1, newSize); // Server uses 1-based page indexing
    }
  };

  // Handle page navigation
  const handlePreviousPage = () => {
    const newPageIndex = pageIndex - 1;
    setPageIndex(newPageIndex);
    if (isServerSidePagination && onPaginationChange) {
      onPaginationChange(newPageIndex + 1, pageSize); // Server uses 1-based page indexing
    } else {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    const newPageIndex = pageIndex + 1;
    setPageIndex(newPageIndex);
    if (isServerSidePagination && onPaginationChange) {
      onPaginationChange(newPageIndex + 1, pageSize); // Server uses 1-based page indexing
    } else {
      table.nextPage();
    }
  };

  const handleExportMockTests = () =>
    exportData({
      startDate: dateRange?.from?.toISOString().split("T")[0],
      endDate: dateRange?.to?.toISOString().split("T")[0],
    });

  return (
    <div className="w-full space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-10 max-w-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isMessaging && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="cursor-pointer" variant={"outline"} asChild>
                  <Link to="send-email">
                    <Mail />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Single/Bulk Email</p>
              </TooltipContent>
            </Tooltip>
          )}
          {/* download */}
          {isExport && (
            <div className="flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"outline"} className="cursor-pointer">
                    <Share />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-w-max">
                  <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                    <DialogDescription />
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className="rounded-lg border shadow-sm"
                    />
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleExportMockTests}
                      disabled={isExporting}
                    >
                      {isExporting ? "Exporting..." : "Confirm"}
                      Export
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {isPaymentFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer" variant={"outline"}>
                  <span>Filter Payments</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/payment?filter=all")}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/payment?filter=paid")}
                >
                  Paid
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/payment?filter=unpaid")}
                >
                  UnPaid
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/payment?filter=partial")}
                >
                  Partial
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            className="cursor-pointer"
            onClick={() => {
              if (addLink) {
                navigate(addLink);
              } else {
                navigate(`/create-student?language=${pathname[0]}`);
              }
            }}
          >
            <span>{addLabel || "Add Student"}</span>
            <Plus />
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

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">
              {isServerSidePagination
                ? pageIndex * pageSize + 1
                : table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {isServerSidePagination
                ? Math.min((pageIndex + 1) * pageSize, totalRows)
                : Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {isServerSidePagination
                ? totalRows
                : table.getFilteredRowModel().rows.length}
            </span>{" "}
            results
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {isServerSidePagination && (
              <span className="text-sm text-muted-foreground">
                Page {pageIndex + 1} of {pageCount}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={
                isServerSidePagination
                  ? pageIndex === 0
                  : !table.getCanPreviousPage()
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={
                isServerSidePagination
                  ? pageIndex >= pageCount - 1
                  : !table.getCanNextPage()
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
