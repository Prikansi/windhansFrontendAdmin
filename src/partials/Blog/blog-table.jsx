"use client";

import React from "react";
import { FaTrashAlt, FaPencilRuler } from "react-icons/fa";
import axiosInstance from "../../api/Axios";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function BlogTable({
  setEditBlog,
  data,
  fetchBlogs,
  totalCount,
  setPageSize,
  setPageIndex,
  pageIndex,
  pageSize,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) {
  const [columnVisibility, setColumnVisibility] = React.useState({});

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const response = await axiosInstance.delete(`/deleteBlogById/${id}`);
      if (response.status === 200) {
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={
            row.original.image
              ? `http://localhost:4000/${row.original.image}`
              : "/placeholder.svg"
          }
          alt={row.original.title} // Use original title for alt text
          className="h-12 w-12 rounded-md object-cover"
        />
      ),
    },
    {
      accessorKey: "title",
      header: () => (
        <button
          onClick={() => handleSort("title")}
          className="flex items-center gap-2"
        >
          Title <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    
    {
      accessorKey: "category",
      header: () => (
        <button
          onClick={() => handleSort("category")}
          className="flex items-center gap-2"
        >
          Category <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
    },
    {
      accessorKey: "author",
      header: () => (
        <button
          onClick={() => handleSort("author")}
          className="flex items-center gap-2"
        >
          Author <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
    },
    {
      accessorKey: "views",
      header: () => (
        <button
          onClick={() => handleSort("views")}
          className="flex items-center gap-2"
        >
          Views <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const blog = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => setEditBlog(blog)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <FaPencilRuler />
            </button>
            <button
              onClick={() => handleDelete(blog.id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              <FaTrashAlt />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      sorting: [{ id: sortBy, desc: sortOrder === "desc" }],
      columnVisibility,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: (sorting) => {
      const sort = sorting[0];
      if (sort) {
        setSortBy(sort.id);
        setSortOrder(sort.desc ? "desc" : "asc");
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
                    <TableCell key={cell.id}>
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
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={data.length < pageSize}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
