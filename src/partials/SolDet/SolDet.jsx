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
  const [solutions, setSolutions] = useState([]); // Store solutions

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

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axiosInstance.get("/getSolutionList"); // Adjust API if needed
        setSolutions(response.data.solution || []);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };

    fetchSolutions();
  }, []);
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
            // setPageSize={setPageSize}
            // setPageIndex={setPageIndex}
            // pageIndex={pageIndex}
            // pageSize={pageSize}
             setViewSolution={setViewSolution}
          />

          {/* Render NewSolutionDetailModal */}
          {newSolDetailOpen && (
            <NewSolutionDetailModal
              setNewSolDetailOpen={setNewSolDetailOpen}
              fetchSolutionDetails={fetchSolutionDetails}
              solutions={solutions}
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
function NewSolutionDetailModal({
  setNewSolDetailOpen,
  fetchSolutionDetails,
  solutions,
}) {
  const [formData, setFormData] = useState({
    solutionId: "",
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

  //it does not overwrite the file append new image in existing one
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleSolutionChange = (e) => {
    const selectedSolution = solutions.find((sol) => sol.id === e.target.value);
    setFormData({
      ...formData,
      solutionId: e.target.value, // Store solutionId
      title: selectedSolution?.title || "", // Optional: auto-fill title
    });
  };

  // const handleDeleteImage = (index) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     screenshot: prevData.screenshot.filter((_, i) => i !== index),
  //   }));
  // };

  const handleDeleteImage = (index, type) => {
    if (type === "existing") {
      setFormData((prevData) => ({
        ...prevData,
        screenshot: prevData.screenshot.filter((_, i) => i !== index),
      }));
    } else {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };

  const handleAddSolutionDetail = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();

      let cleanedContent = formData.content.replace(/<\/?p>/g, "").trim();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "screenshot") {
          data.append(key, key === "content" ? cleanedContent : value);
        }
      });

      // Append existing screenshots (if any)
      if (
        Array.isArray(formData.screenshot) &&
        formData.screenshot.length > 0
      ) {
        data.append("existingScreenshot", JSON.stringify(formData.screenshot));
      }

      // Append new images
      if (files.length > 0) {
        files.forEach((file) => {
          data.append("screenshot", file);
        });
      }

      const response = await axiosInstance.post("/addSolutionDetail", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        await fetchSolutionDetails(); // Refresh table
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
            <label className="block text-sm font-medium mb-1">Solution</label>
            <select
              name="solutionId"
              required
              value={formData.solutionId}
              onChange={handleSolutionChange} // This is the correct place
              className="border p-2 w-full"
            >
              <option value="">Select a Solution</option>
              {solutions.map((sol) => (
                <option key={sol.id} value={sol.id}>
                  {sol.title}
                </option>
              ))}
            </select>
          </div>
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

            {Array.isArray(formData.screenshot) &&
              formData.screenshot.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Existing Images:</p>
                  <ul className="list-disc pl-4 text-sm text-gray-600">
                    {formData.screenshot.map((img, index) => (
                      <li key={index}>
                        <button
                          className="text-red-500 hover:text-grey-700"
                          onClick={() => handleDeleteImage(index, "existing")}
                        >
                          ❌
                        </button>
                        {typeof img === "string"
                          ? img.split("/").pop()
                          : "Invalid Image"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Show newly selected images */}
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">New Images:</p>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  {files.map((file, index) => (
                    <li key={index}>
                      <button
                        className="text-red-500 hover:text-grey-700"
                        onClick={() => handleDeleteImage(index, "new")}
                      >
                        ❌
                      </button>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
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
