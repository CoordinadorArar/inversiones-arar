import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Settings2, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

/**
 * DataTable - con todas las funcionalidades
 * 
 * Características:
 * - Búsqueda global
 * - Paginación adaptable a mobile
 * - Ordenamiento por columnas
 * - Selector de columnas visibles
 * - Scroll horizontal en mobile
 * - Layout adaptativo en toolbar y paginación
 * 
 * @author Yariangel Aray - Tabla de referencia para todo el sistema
 * @version 1.0
 * @date 2025-11-28
 */

interface DataTableProps<TData, TValue = unknown> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  searchPlaceholder = "Buscar...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* TOOLBAR RESPONSIVO - Stack en mobile, row en desktop */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 flex-shrink-0">
        {/* Búsqueda - Full width en mobile */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9"
          />
        </div>

        {/* Botón columnas - Full width en mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-primary/20 hover:border-primary/40 hover:text-primary w-full sm:w-auto"
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* TABLA CON SCROLL HORIZONTAL EN MOBILE */}
      <div className="flex-1 rounded-lg border border-primary/10 overflow-hidden min-h-0 shadow-sm">
        {/* 
          overflow-x-auto: Permite scroll horizontal en mobile
          overflow-y-auto: Permite scroll vertical
        */}
        <div className="overflow-auto h-full">
          <Table>
            {/* HEADER - Sticky en scroll vertical */}
            <TableHeader className="sticky top-0 z-10 bg-primary/90 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-primary-foreground whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          {header.column.getCanSort() ? (
                            <Button
                              variant="ghost"
                              className="h-8 px-2 hover:!bg-primary/90 hover:text-primary-foreground font-semibold"
                              onClick={() => header.column.toggleSorting()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp className="ml-2 h-3.5 w-3.5" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown className="ml-2 h-3.5 w-3.5" />
                              ) : (
                                <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                              )}
                            </Button>
                          ) : (
                            <span className="px-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* BODY */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="transition-colors border-b border-border/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3 font-medium text-foreground/80"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-sm font-medium">No se encontraron resultados</p>
                      <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINACIÓN RESPONSIVA */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center sm:justify-between gap-3 sm:gap-4 flex-shrink-0 pt-2">
        {/* Fila 1: Info de resultados (centrada en mobile) */}
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Mostrando{" "}
          <span className="font-semibold text-foreground">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>
          {" - "}
          <span className="font-semibold text-foreground">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>
          {" de "}
          <span className="font-semibold text-foreground">
            {table.getFilteredRowModel().rows.length}
          </span>
          {" resultado(s)"}
        </div>

        {/* Fila 2: Controles (stack en mobile, row en desktop) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Selector de filas por página */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <p className="text-sm font-medium whitespace-nowrap">Filas por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-9 w-[75px] border-primary/20">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 justify-between">
            {/* Indicador de página */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </span>
            </div>

            {/* Botones de navegación */}
            <div className="flex items-center sm:justify-end gap-1">
              {/* Ocultar botones de primera/última en mobile */}
              <Button
                variant="outline"
                size="icon"
                className="hidden sm:flex h-9 w-9 border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Ocultar botones de primera/última en mobile */}
              <Button
                variant="outline"
                size="icon"
                className="hidden sm:flex h-9 w-9 border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}