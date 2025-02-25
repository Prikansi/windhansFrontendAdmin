import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import axiosInstance from "../../api/Axios";
import { FaTrashAlt, FaPencilRuler, FaPlus } from "react-icons/fa";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function Slider() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newImageModalOpen, setNewImageModalOpen] = useState(false);

  useEffect(() => {
    fetchSliderImages();
  }, []);

  const fetchSliderImages = async () => {
    try {
      const response = await axiosInstance.get("/getImageList");
      if (response.data && response.data.imageList) {
        setSliderImages(response.data.imageList);
      } else {
        setError("No images found.");
      }
    } catch (err) {
      setError("Error fetching images");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="h-24 w-24 rounded-md overflow-hidden">
          <img
            src={`http://localhost:4000/${row.original.image.replace(/\\/g, "/")}`}
            alt={`Image ${row.original.id}`}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "sequence",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Sequence
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("sequence")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { id, status } = row.original;
        const handleStatusChange = (e) => {
          const newStatus = e.target.checked ? "Active" : "Inactive";
          updateStatus(id, newStatus);
        };
        return (
          <Checkbox
            checked={status === "Active"}
            onCheckedChange={handleStatusChange}
            aria-label={`Status for image ${id}`}
          />
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center"
          >
            <FaPencilRuler />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center"
          >
            <FaTrashAlt className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: sliderImages,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axiosInstance.delete(`/deleteImageById/${id}`);
      setSliderImages((prevImages) => prevImages.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/updateImageStatus/${id}`, { status: newStatus });
      setSliderImages((prevImages) =>
        prevImages.map((image) => (image.id === id ? { ...image, status: newStatus } : image))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Image Slider</h1>
            <button
              onClick={() => setNewImageModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPlus /> Add New
            </button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
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
                      No images found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
      {newImageModalOpen && <NewImageModal setNewImageModalOpen={setNewImageModalOpen} fetchSliderImages={fetchSliderImages} />}
    </div>
  );
}

function NewImageModal({ setNewImageModalOpen, fetchSliderImages }) {
  const [file, setFile] = useState(null);
  const [sequence, setSequence] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("sequence", sequence);
      formData.append("status", status);

      await axiosInstance.post("/insertImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchSliderImages();
      setNewImageModalOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Add New Image</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" required onChange={(e) => setFile(e.target.files[0])} className="border p-2 w-full mb-2" accept="image/*" />
          <input type="number" required value={sequence} onChange={(e) => setSequence(e.target.value)} className="border p-2 w-full mb-2" placeholder="Sequence" />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setNewImageModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
