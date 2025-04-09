"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import axiosInstance from "../../api/Axios";
import { SolDetTable } from "./SolDetTable";
import SolDetEdit from "./SolDetEdit";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS

export default function SolDet() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newSolDetailOpen, setNewSolDetailOpen] = useState(false);
  const [solutionDetails, setSolutionDetails] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [editSolution, setEditSolution] = useState(null);
  const [viewSolution, setViewSolution] = useState(null);

  // Fetch solution details
  const fetchSolutionDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/getSolDetList?page=${pageIndex + 1}&limit=${pageSize}`
      );
      console.log("Fetched solution details:", response.data);

      setSolutionDetails(response.data.solution || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching solution details:", error);
    }
  };

  useEffect(() => {
    fetchSolutionDetails();
  }, []); // Corrected dependency array

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow overflow-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Solution Detail
            </h1>
            <div className="flex space-x-2">
              {/* <button
                onClick={fetchSolutionDetails}
                className="bg-blue-500 text-white px-3 py-2 rounded"
                title="Refresh"
              >
                🔄 Refresh
              </button> */}
              <button
                onClick={() => setNewSolDetailOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                New Detail
              </button>
            </div>
          </div>

          {/* Use SolDetTable */}
          <SolDetTable
            setEditSolution={setEditSolution}
            data={solutionDetails}
            fetchSolutions={fetchSolutionDetails}
            totalCount={totalCount}
            setPageSize={setPageSize}
            setPageIndex={setPageIndex}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setViewSolution={setViewSolution}
          />

          {/* Render NewSolutionDetailModal */}
          {newSolDetailOpen && (
            <NewSolutionDetailModal
              setNewSolDetailOpen={setNewSolDetailOpen}
              fetchSolutionDetails={fetchSolutionDetails}
            />
          )}

          {/* Render SolDetEdit */}
          {editSolution && (
            <SolDetEdit
              solution={editSolution}
              setEditSolution={setEditSolution}
              fetchSolutions={fetchSolutionDetails}
            />
          )}

          {/* View Solution Modal */}
          {viewSolution && (
            <ViewSolutionModal
              solution={viewSolution}
              setViewSolution={setViewSolution}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// NewSolutionDetailModal component
function NewSolutionDetailModal({ setNewSolDetailOpen, fetchSolutionDetails }) {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    description: "",
    content: "",
    objective: "",
  });

  console.log("first", formData);

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleAddSolutionDetail = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Add files
      if (files.length > 0) {
        files.forEach((file) => {
          data.append("screenshot", file);
        });
      }

      const response = await axiosInstance.post("/addSolutionDetail", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        await fetchSolutionDetails(); // Refresh the list
        setNewSolDetailOpen(false);
      }
    } catch (error) {
      console.error("Error adding solution detail:", error);
      alert("Failed to add solution detail. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-lg font-semibold mb-4">New Solution Detail</h2>
        <form onSubmit={handleAddSolutionDetail}>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Title"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Domain</label>
            <input
              name="domain"
              required
              value={formData.domain}
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Domain"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Description"
              rows="3"
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Features</label>
           
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleQuillChange}
            />
            
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              Screenshots
            </label>
            <input
              type="file"
              multiple
              required
              onChange={handleFileChange}
              className="border p-2 w-full"
              accept="image/*"
            />
            {files.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setNewSolDetailOpen(false)}
              className="ml-2 bg-gray-300 px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ViewSolutionModal component
function ViewSolutionModal({ solution, setViewSolution }) {
  let screenshots = [];

  try {
    if (solution.screenshot) {
      screenshots = JSON.parse(solution.screenshot);
      if (!Array.isArray(screenshots)) {
        screenshots = [];
      }
    }
  } catch (error) {
    console.error("Error parsing screenshots:", error);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{solution.title}</h2>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Domain</h3>
          <p>{solution.domain}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Description</h3>
          <p>{solution.description}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Features</h3>
          <p>{solution.content}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Objective</h3>
          <p>{solution.objective}</p>
        </div>

        {screenshots.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Screenshots</h3>
            <div className="grid grid-cols-2 gap-2">
              {screenshots.map((imgPath, index) => (
                <img
                  key={index}
                  src={`http://localhost:4000/${imgPath}`}
                  alt={`screenshot-${index}`}
                  className="rounded-md object-cover w-full h-auto"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setViewSolution(null)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
