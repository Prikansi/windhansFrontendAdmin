"use client";

import React, { useState } from "react";
import { FaTrashAlt, FaPencilRuler } from "react-icons/fa";
import axiosInstance from "../../api/Axios";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel, // ✅ Include Pagination
} from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
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

export function SolutionListTable({ setEditSolution, data, fetchSolutions }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this solution?")) return;
    try {
      const response = await axiosInstance.delete(`/deleteSolutionList/${id}`);
      if (response.status === 200) {
        fetchSolutions();
      }
    } catch (error) {
      console.error("Error deleting solution:", error);
    }
  };

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image ? `http://localhost:4000/${row.original.image}` : "/placeholder.svg"}
              alt="title"
              className="h-12 w-12 rounded-md object-cover"
            />
          </div>
        ),
        meta: { className: "text-center" },
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Title <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
      },
      {
        accessorKey: "domain",
        header: "Domain",
        cell: ({ row }) => row.getValue("domain"),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.getValue("description"),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
          const solution = row.original;
          return (
            <div className="flex items-center justify-center space-x-2 min-w-[100px]">
              <button
                onClick={() => setEditSolution(solution)}
                className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
              >
                <FaPencilRuler />
              </button>
              <button
                onClick={() => handleDelete(solution.id)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <FaTrashAlt />
              </button>
            </div>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // ✅ Enable Pagination
    state: { globalFilter, sorting },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
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
            {data.length ? (
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
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
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
  );
}
