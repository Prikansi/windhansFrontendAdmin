"use client"

import { useState } from "react"
import { FaTrashAlt, FaPencilRuler, FaEye } from "react-icons/fa"
import axiosInstance from "../../api/Axios"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SolDetTable({
  setEditSolution,
  data,
  fetchSolutions,
  totalCount,
  setViewSolution,
}) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id) => {
    if (isDeleting) return
    if (!window.confirm("Are you sure you want to delete this solution?")) return

    setIsDeleting(true)
    try {
      const response = await axiosInstance.delete(`/deleteSolDet/${id}`)
      if (response.status === 200) {
        await fetchSolutions()
      }
    } catch (error) {
      console.error("Error deleting solution:", error)
      alert("Failed to delete solution. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = [
    {
      accessorKey: "screenshot",
      header: "Screenshot",
      cell: ({ row }) => {
        let screenshots = []

        try {
          if (row.original.screenshot && typeof row.original.screenshot === "string") {
            screenshots = JSON.parse(row.original.screenshot)
            if (!Array.isArray(screenshots)) {
              screenshots = []
            }
          }
        } catch (error) {
          console.error("Error parsing screenshot:", error)
        }

        return (
          <div className="flex justify-center items-center space-x-2">
            {screenshots.length > 0 ? (
              <img
                src={`http://localhost:4000/${screenshots[0]}`}
                alt="screenshot"
                className="h-12 w-12 rounded-md object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg"
                }}
              />
            ) : (
              <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                No image
              </div>
            )}
            {screenshots.length > 1 && (
              <span className="text-xs bg-gray-200 rounded-full px-2 py-1">+{screenshots.length - 1}</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "domain",
      header: "Domain",
      cell: ({ row }) => row.getValue("domain") || "N/A",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description")
        return description ? (
          <div className="max-w-xs truncate" title={description}>
            {description}
          </div>
        ) : (
          "N/A"
        )
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const solution = row.original
        return (
          <div className="flex items-center justify-center space-x-2 min-w-[120px]">
            {/* <button
              onClick={() => setViewSolution(solution)}
              className="p-1.5 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
              title="View"
            >
              <FaEye />
            </button> */}
            <button
              onClick={() => setEditSolution(solution)}
              className="p-1.5 text-green-600 border border-green-300 rounded-md hover:bg-green-50"
              title="Edit"
            >
              <FaPencilRuler />
            </button>
            <button
              onClick={() => handleDelete(solution.id)}
              className="p-1.5 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              disabled={isDeleting}
              title="Delete"
            >
              <FaTrashAlt />
            </button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
     getPaginationRowModel: getPaginationRowModel(), // ✅ Enable Pagination
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="table-auto w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()} // ✅ Corrected previous page navigation
                disabled={!table.getCanPreviousPage()} // ✅ Corrected disabled state
                className={`px-4 py-2 rounded-md ${
                  !table.getCanPreviousPage()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </Button>
      
              <span className="text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} {/* ✅ Show correct page number */}
              </span>
      
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()} // ✅ Corrected next page navigation
                disabled={!table.getCanNextPage()} // ✅ Corrected disabled state
                className={`px-4 py-2 rounded-md ${
                  !table.getCanNextPage()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </Button>
            </div>
    </div>
  )
}
