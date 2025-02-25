import React, { useState} from "react";
import { FaTrashAlt, FaPencilRuler } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io5";
import axiosInstance from "../../api/Axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

export function TeamTable({ data, setData, setEditTeam, fetchTeams }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?"))
      return;
    try {
      const response = await axiosInstance.delete(`/deleteMember/${id}`);
      if (response.status === 200) {
        fetchTeams();
      } else {
        console.error("Failed to delete team member:", response);
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  const columns = [
    // {
    //   accessorKey: "name",
    //   header: ({ column }) => (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="ml-14"
    //     >
    //       Name
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-4">
    //       <img
    //         src={
    //           row.original.image
    //             ? `http://localhost:4000/${row.original.image}`
    //             : "/placeholder.svg"
    //         }
    //         alt={row.getValue("name")}
    //         className="h-12 w-12 rounded-md object-cover"
    //       />
    //       <div className="font-medium">{row.getValue("name")}</div>
    //     </div>
    //   ),
    // },

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
        // {
        //   accessorKey: "name",
        //   header: () => (
        //     <button
        //       onClick={() => handleSort("name")}
        //       className="flex items-center gap-2"
        //     >
        //       Name <ArrowUpDown className="h-4 w-4" />
        //     </button>
        //   ),
        //   cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        // },
        {
          accessorKey: "name",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("name")}</div>,
        },
    {
      accessorKey: "designation",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Designation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("designation")}</div>,
    },

    {
      accessorKey: "joiningDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          JoiningDate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("joiningDate")).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "leavingDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          LeavingDate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("leavingDate")).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "socialMediaLinks",
      header: "Social Media",
      cell: ({ row }) => {
        // Debugging: Check what data is coming
        console.log("Social Media Data:", row.original.socialMediaLinks);

        const links =
          typeof row.original.socialMediaLinks === "string"
            ? JSON.parse(row.original.socialMediaLinks)
            : row.original.socialMediaLinks;

        return (
          <div className="flex gap-2 text-sm">
            {links?.linkedin ? (
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                LinkedIn
              </a>
            ) : (
              <span className="text-gray-400">No LinkedIn</span>
            )}
            {links?.github ? (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <IoLogoGithub className="w-6 h-6" />
              </a>
            ) : (
              <span className="text-gray-400">No GitHub</span>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const team = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => setEditTeam(team)}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <FaPencilRuler />
            </button>
            <button
              onClick={() => handleDelete(team.id)}
              className="px-2 py-1 bg-red-500 text-white rounded-md"
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
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter by name..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}

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
      <div className="rounded-md border">
        <Table>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
