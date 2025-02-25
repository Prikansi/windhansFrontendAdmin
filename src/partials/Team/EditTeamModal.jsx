import { useState } from "react";
import axiosInstance from "../../api/Axios";

export default function EditTeamModal({ team, setEditTeam, fetchTeams }) {
  const [formData, setFormData] = useState({
    name: team.name || "",
    designation: team.designation || "",
    joiningDate: team.joiningDate || "",
    leavingDate: team.leavingDate || "",
    image: team.image || null,
    category: team.category || "", // <-- Added category field
    //socialMediaLinks: team.socialMediaLinks || { linkedin: "", github: "" },
    socialMediaLinks: typeof team.socialMediaLinks === "string" 
    ? JSON.parse(team.socialMediaLinks) 
    : team.socialMediaLinks || { linkedin: "", github: "" },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name.startsWith("socialMediaLinks")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        socialMediaLinks: { ...formData.socialMediaLinks, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "socialMediaLinks") {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (key === "image" && value instanceof File) {
        formDataToSend.append("image", value);
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await axiosInstance.put(`/updateMember/${team.id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setEditTeam(null);
        fetchTeams();
      }
    } catch (error) {
      console.error("Error updating team member:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 mt-10">Update Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          
          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="leadership">Leadership</option>
              <option value="management">Management</option>
              <option value="advisory">Advisory</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Leaving Date</label>
              <input
                type="date"
                name="leavingDate"
                value={formData.leavingDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Profile Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              accept="image/*"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">LinkedIn</label>
              <input
                type="text"
                name="socialMediaLinks.linkedin"
                value={formData.socialMediaLinks.linkedin}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-2">GitHub</label>
              <input
                type="text"
                name="socialMediaLinks.github"
                value={formData.socialMediaLinks.github}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Save
            </button>
            <button type="button" onClick={() => setEditTeam(null)} className="px-4 py-2 bg-red-500 text-white rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
