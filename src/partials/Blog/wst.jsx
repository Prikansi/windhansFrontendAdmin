import React,{useState} from "react"
import { FaTrashAlt, FaPencilRuler } from "react-icons/fa"
import axiosInstance from "../../api/Axios"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BlogTable({ data, setData, setEditBlog }) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [globalFilter, setGlobalFilter] = useState("");
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return
    try {
      const response = await axiosInstance.delete(`/deleteBlogById/${id}`)
      if (response.status === 200) {
        setData((prevData) => prevData.filter((blog) => blog.id !== id))
      } else {
        console.error("Failed to delete blog:", response)
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
    }
  }

  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="ml-14">
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <img
            src={row.original.image ? `http://localhost:4000/${row.original.image}` : "/placeholder.svg"}
            alt={row.getValue("title")}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div className="font-medium">{row.getValue("title")}</div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <div>{row.getValue("author")}</div>,
    },
    {
      accessorKey: "views",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-8">{row.getValue("views")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{new Date(row.getValue("date")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "action",
      header: () => <Button variant="ghost">Action</Button>,
      cell: ({ row }) => {
        const blog = row.original
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => setEditBlog(blog)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center"
            >
              <FaPencilRuler />
            </button>
            <button
              onClick={() => handleDelete(blog.id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center"
            >
              <FaTrashAlt className="h-4 w-4" />
            </button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilter, // ✅ Passed globalFilter state to table
    onGlobalFilterChange: setGlobalFilter, // ✅ Updates globalFilter when input changes
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter, // ✅ Global filter is now part of the table's state
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
       <Input
                 placeholder="Search..."
                 value={globalFilter}
                 onChange={(e) => setGlobalFilter(e.target.value)} // ✅ Updates globalFilter state
                 className="max-w-sm"
               />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}

