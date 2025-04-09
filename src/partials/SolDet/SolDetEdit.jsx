"use client";

import { useState } from "react";
import axiosInstance from "../../api/Axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS

export default function SolDetEdit({
  solution,
  setEditSolution,
  fetchSolutions,
}) {
  // Initialize screenshot data properly
  const [formData, setFormData] = useState({
    ...solution,
    screenshot: Array.isArray(solution.screenshot)
      ? solution.screenshot
      : typeof solution.screenshot === "string"
      ? solution.screenshot.split(",").map((item) => item.trim())
      : [],
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, content: value }); // Store HTML content
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      screenshot: prevData.screenshot.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();

      let cleanedContent = formData.content
        .replace(/<\/?p>/g, "")
        .replace(/<br\s*\/?>/g, "")
        .trim();

      // Append all form fields except images
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "screenshot") {
          //data.append(key, value);
          data.append(key, key === "content" ? cleanedContent : value);
        }
      });

      // Handle existing screenshots - send as a plain array, not stringified
      if (formData.screenshot && formData.screenshot.length > 0) {
        // Send as a simple array, backend will handle it
        data.append("existingScreenshot", JSON.stringify(formData.screenshot));
      }

      // Append new files if any
      if (files.length > 0) {
        files.forEach((file) => {
          data.append("screenshot", file);
        });
      }

      const response = await axiosInstance.put(
        `/updateSolutionDetail/${solution.id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        await fetchSolutions();
        setEditSolution(null);
      }
    } catch (error) {
      console.error("Error updating solution details:", error);
      alert("Failed to update solution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Solution Details</h2>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Title"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Domain</label>
          <input
            name="domain"
            value={formData.domain || ""}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Domain"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Description"
            rows="3"
          ></textarea>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">
            Features/Content
          </label>
          <ReactQuill
            theme="snow"
            value={formData.content || ""}
            onChange={handleQuillChange}
          />
          ;
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 w-full mb-2"
            accept="image/*"
            multiple
          />

          {/* Display Current Images */}
          {Array.isArray(formData.screenshot) &&
            formData.screenshot.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current Images:</p>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  {formData.screenshot.map((img, index) => (
                    <li key={index}>
                      <button
                        className="text-red-500 hover:text-grey-700"
                        onClick={() => handleDeleteImage(index)}
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
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setEditSolution(null)}
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
