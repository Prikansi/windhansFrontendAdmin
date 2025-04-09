import { useState } from "react";
import axiosInstance from "../../api/Axios";

export default function EditSolutionListModal({ solution, setEditSolution, fetchSolutions }) {
  const [formData, setFormData] = useState({ ...solution });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();
//       for (const key in formData) {
//         data.append(key, formData[key]);
//       }
//       if (file) {
//         data.append("image", file);
//       }

//       const response = await axiosInstance.put(`/updateSolutionList/${solution.id}`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.status === 200) {
//         setEditSolution(null);
//         fetchSolutions(); // Refetch latest solutions to update UI
//       }
//     } catch (error) {
//       console.error("Error updating solution:", error);
//     }
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
  
      for (const key in formData) {
        if (key !== "image") { // Prevent overriding the image unnecessarily
          data.append(key, formData[key]);
        }
      }
  
      if (file) {
        data.append("image", file); // Append new image if selected
      } else if (solution.image) {
        data.append("image", solution.image); // Retain existing image if no new file is uploaded
      }
  
      const response = await axiosInstance.put(`/updateSolutionList/${solution.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        setEditSolution(null);
        fetchSolutions(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating solution:", error);
    }
  };
  

return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Solution</h2>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Title"
        />

        <input
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Domain"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Description"
          rows="3"
        ></textarea>

        <input type="file" onChange={handleFileChange} className="border p-2 w-full mb-2" accept="image/*" />

        <div className="flex justify-end mt-4">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={() => setEditSolution(null)} className="ml-2 bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
