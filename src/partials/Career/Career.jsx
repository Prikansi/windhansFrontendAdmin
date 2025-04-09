import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { CareerTable } from "./CareerTable"; // Adjust the path as needed
import axiosInstance from "../../api/Axios";

export default function Career() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOpeningModalOpen, setNewOpeningModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // When a new opening is added successfully, close the modal and trigger a refresh.
  const handleNewOpeningSuccess = () => {
    setNewOpeningModalOpen(false);
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="grow overflow-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Career
            </h1>
            <button
              onClick={() => setNewOpeningModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add New
            </button>
          </div>
          {/* Pass the refresh prop so that CareerTable re-fetches the data when it changes */}
          <CareerTable refresh={refresh} />
        </main>
      </div>

      {/* {condition && component} */}
      {newOpeningModalOpen && (
        <NewOpeningModal
          setNewOpeningModalOpen={setNewOpeningModalOpen}
          onSuccess={handleNewOpeningSuccess} 
        />
      )}
    </div>
  );
}

// Modal Component for Adding a New Opening
function NewOpeningModal({ setNewOpeningModalOpen, onSuccess }) {
  const [formData, setFormData] = useState({
    openings: "",
    responsibility: "",
    reqQualification: "",
    experience: "",
    skills: "",
    location: "",
    image: null, // Add image field
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFile(files[0]); // Store file separately
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (file) {
        data.append("image", file);
      }

      const response = await axiosInstance.post("/addOpening", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201 || response.status === 200) {
        onSuccess();
      } else {
        console.error("Failed to add opening:", response);
      }
    } catch (error) {
      console.error("Error adding opening:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add New Opening</h2>
        <form onSubmit={handleSubmit}>
          {/* Existing Fields */}
          <input type="text" name="openings" value={formData.openings} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Openings" required />
          <input type="text" name="responsibility" value={formData.responsibility} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Responsibility" required />
          <input type="text" name="reqQualification" value={formData.reqQualification} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Qualification" required />
          <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Experience" required />
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Skills" required />
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Location" required />

          {/* New Image Upload Field */}
          <input type="file" name="image" onChange={handleChange} className="w-full border p-2 mb-2" accept="image/*" required />

          <div className="flex justify-end space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            <button type="button" onClick={() => setNewOpeningModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

