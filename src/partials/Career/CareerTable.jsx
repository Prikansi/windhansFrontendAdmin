import React, { useState, useEffect } from "react";
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
import { FaPencilRuler, FaTrashAlt } from "react-icons/fa";
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

export function CareerTable({ refresh }) {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [editOpening, setEditOpening] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  // Fetch the list of openings from the API
  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get("/listAllOpenings");
      console.log("API Response:", response.data);
      if (response.data && response.data.openings) {
        setData(response.data.openings);
      }
    } catch (error) {
      console.error("Error fetching job applications:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [refresh]);

  // Delete handler calls deleteOpeningById endpoint
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this opening?"))
      return;
    try {
      const response = await axiosInstance.delete(`/deleteOpeningById/${id}`);
      if (response.status === 200) {
        setData((prevData) => prevData.filter((opening) => opening.id !== id));
      } else {
        console.error("Failed to delete opening:", response);
      }
    } catch (error) {
      console.error("Error deleting opening:", error);
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <img
            src={
              row.original.image
                ? `http://localhost:4000/${row.original.image}`
                : "/placeholder.svg"
            }
            alt="Career"
            className="h-12 w-12 rounded-md object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "openings",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Openings
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-8">{row.getValue("openings")}</div>,
    },
    {
      accessorKey: "responsibility",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Responsibility
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("responsibility")}</div>,
    },
    {
      accessorKey: "reqQualification",
      header: "Qualification",
      cell: ({ row }) => <div>{row.getValue("reqQualification")}</div>,
    },
    {
      accessorKey: "experience",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Experience
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("experience")}</div>,
    },
    {
      accessorKey: "skills",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Skills
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("skills")}</div>,
    },
    
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const opening = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => setEditOpening(opening)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center"
            >
              <FaPencilRuler />
            </button>
            <button
              onClick={() => handleDelete(opening.id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center"
            >
              <FaTrashAlt className="h-4 w-4" />
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
    globalFilter,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Search by qualification..."
          value={table.getColumn("reqQualification")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("reqQualification")?.setFilterValue(event.target.value)}
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
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
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
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
      {/* Render update modal when editOpening is set */}
      {editOpening && (
        <EditOpeningModal
          editOpening={editOpening}
          setEditOpening={setEditOpening}
          onUpdateSuccess={fetchJobs}
        />
      )}
    </div>
  );
}

// Modal Component for updating an opening
function EditOpeningModal({ editOpening, setEditOpening, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    openings: editOpening.openings || "",
    responsibility: editOpening.responsibility || "",
    reqQualification: editOpening.reqQualification || "",
    experience: editOpening.experience || "",
    skills: editOpening.skills || "",
    location: editOpening.location || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    // Create FormData object
    const formDataToSend = new FormData();
  
    // Append text fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
  
    // Append image if selected
    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }
  
    try {
      const response = await axiosInstance.put(
        `/updateOpeningbyId/${editOpening.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        onUpdateSuccess(); // Refresh the data
        setEditOpening(null);
      } else {
        console.error("Failed to update opening:", response);
      }
    } catch (error) {
      console.error("Error updating opening:", error);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Update Opening</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block mb-1">Openings</label>
            <input
              type="text"
              name="openings"
              value={formData.openings}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Responsibility</label>
            <input
              type="text"
              name="responsibility"
              value={formData.responsibility}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Qualification</label>
            <input
              type="text"
              name="reqQualification"
              value={formData.reqQualification}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 w-full mb-2"
            accept="image/*"
          />

          <div className="mb-4">
            <label className="block mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditOpening(null)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
