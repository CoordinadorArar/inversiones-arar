/**
 * Componente DataTable - Tabla avanzada con múltiples funcionalidades.
 * 
 * Propósito: Componente reutilizable para mostrar datos tabulares con búsqueda global,
 * paginación, ordenamiento por columnas, visibilidad de columnas toggleable, y diseño responsive.
 * Usa TanStack Table (React Table) para manejo eficiente de datos y estado.
 * 
 * Características principales:
 * - Búsqueda global con input.
 * - Paginación con selector de filas por página.
 * - Ordenamiento asc/desc por columnas clickeables.
 * - Toggle de visibilidad de columnas via dropdown.
 * - Diseño responsive: Stack en mobile, row en desktop; scroll horizontal.
 * - Estados vacíos con mensaje amigable.
 * - Header sticky, backdrop blur para mejor UX.
 * 
 * Props:
 * - data: Array de datos a mostrar (TData[]).
 * - columns: Definición de columnas (ColumnDef<TData, TValue>[]).
 * - searchPlaceholder: Placeholder para input de búsqueda (opcional).
 * - initialColumnVisibility: Estado inicial de visibilidad de columnas (opcional).
 * 
 * Dependencias: TanStack Table, componentes UI de Shadcn (Table, Input, Button, etc.).
 * 
 * @author Yariangel Aray - Tabla de referencia para todo el sistema.
 
 * @date 2025-11-27
 */

// Imports: Hooks de React, TanStack Table, componentes UI, íconos.
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

// Interface genérica para props del componente.
interface DataTableProps<TData, TValue = unknown> {
  data: TData[];  // Datos a tabular.
  columns: ColumnDef<TData, TValue>[];  // Definición de columnas.
  searchPlaceholder?: string;  // Placeholder para búsqueda (default "Buscar...").
  initialColumnVisibility?: VisibilityState | {};  // Visibilidad inicial de columnas.
}

// Componente funcional genérico DataTable.
export function DataTable<TData, TValue>({
  data,
  columns,
  searchPlaceholder = "Buscar...",
  initialColumnVisibility = {}
}: DataTableProps<TData, TValue>) {
  // Estados para TanStack Table: sorting, filtros, visibilidad, búsqueda global.
  const [sorting, setSorting] = useState<SortingState>([]);  // Estado de ordenamiento.
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);  // Filtros por columna.
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);  // Visibilidad de columnas.
  const [globalFilter, setGlobalFilter] = useState("");  // Filtro global (búsqueda).

  // Función personalizada para filtro global
  const customGlobalFilterFn = (row: any, columnId: string, filterValue: string) => {
    const search = filterValue.toLowerCase();
    const rowData = row.original as any;

    // Busca en todos los campos planos
    return Object.keys(rowData).some(key => {
      const value = rowData[key];
      if (value === null || value === undefined) return false;

      // Si es string, búsqueda directa
      if (typeof value === 'string') {
        return value.toLowerCase().includes(search);
      }

      // Si es número, conviértelo a string
      if (typeof value === 'number') {
        return value.toString().includes(search);
      }

      return false;
    });
  };

  // Instancia de tabla TanStack con modelos y estados.
  const table = useReactTable({
    data,  // Datos pasados.
    columns,  // Columnas pasadas.
    getCoreRowModel: getCoreRowModel(),  // Modelo base.
    getPaginationRowModel: getPaginationRowModel(),  // Paginación.
    getSortedRowModel: getSortedRowModel(),  // Ordenamiento.
    getFilteredRowModel: getFilteredRowModel(),  // Filtros.
    globalFilterFn: customGlobalFilterFn,
    onSortingChange: setSorting,  // Handler para sorting.
    onColumnFiltersChange: setColumnFilters,  // Handler para filtros.
    onColumnVisibilityChange: setColumnVisibility,  // Handler para visibilidad.
    onGlobalFilterChange: setGlobalFilter,  // Handler para búsqueda global.
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,  // Tamaño inicial de página.
      },
    },
  });

  // Render: Contenedor flex col con toolbar, tabla y paginación.
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* TOOLBAR RESPONSIVO: Input de búsqueda y dropdown de columnas. */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 flex-shrink-0">
        {/* Input de búsqueda global con ícono. */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9"
          />
        </div>

        {/* Dropdown para toggle de visibilidad de columnas. */}
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
            {/* Mapea columnas que se pueden ocultar, con checkbox. */}
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())  // Solo columnas hideables.
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}  // Estado actual.
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)  // Toggle visibilidad.
                    }
                  >
                    {/* Nombre de columna. */}
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* TABLA CON SCROLL: Contenedor con overflow para scroll horizontal/vertical. */}
      <div className="flex-1 rounded-lg border border-primary/10 overflow-hidden min-h-0 shadow-sm">
        <div className="overflow-auto h-full">
          <Table>
            {/* HEADER STICKY: Fijo en scroll vertical con backdrop. */}
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
                          {/* Si columna es sorteable, botón con ícono de flecha. */}
                          {header.column.getCanSort() ? (
                            <Button
                              variant="ghost"
                              className="h-8 px-2 hover:!bg-primary/90 hover:text-primary-foreground font-semibold"
                              onClick={() => header.column.toggleSorting()}  // Toggle sorting.
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {/* Ícono según estado de sorting. */}
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp className="ml-2 h-3.5 w-3.5" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown className="ml-2 h-3.5 w-3.5" />
                              ) : (
                                <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                              )}
                            </Button>
                          ) : (
                            // Si no sorteable, solo texto.
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

            {/* BODY: Filas de datos o estado vacío. */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                // Si hay filas, mapea y renderiza.
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
                // Estado vacío: Mensaje con ícono.
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

      {/* PAGINACIÓN RESPONSIVA: Info, selector de filas, navegación. */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center sm:justify-between gap-3 sm:gap-4 flex-shrink-0 pt-2">
        {/* Info de resultados mostrados. */}
        <div className="text-sm text-muted-foreground text-center sm:text-left flex flex-wrap">
          <span>
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
          </span>
          <span className="ml-1">
            {" de "}
            <span className="font-semibold text-foreground">
              {table.getFilteredRowModel().rows.length}
            </span>
            {" resultado(s)"}
          </span>
        </div>

        {/* Controles: Selector de filas por página y navegación. */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Selector de filas por página. */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <p className="text-sm font-medium whitespace-nowrap">Filas por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));  // Cambia pageSize.
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
            {/* Indicador de página actual. */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </span>
            </div>

            {/* Botones de navegación de página. */}
            <div className="flex items-center sm:justify-end gap-1">
              {/* Botón primera página (oculto en mobile). */}
              <Button
                variant="outline"
                size="icon"
                className="hidden sm:flex h-9 w-9 border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Botón página anterior. */}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Botón página siguiente. */}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Botón última página (oculto en mobile). */}
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
