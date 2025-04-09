import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import axiosInstance from "../../api/Axios";
import { TeamTable } from "./TeamTable";
import EditTeamModal from "./EditTeamModal";

export default function Team() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [editTeam, setEditTeam] = useState(null);
  const [newTeamModalOpen, setNewTeamModalOpen] = useState(false);

  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get("/listAllTeamMember");
      if (response.data && response.data.teamMembers) {
        setTeams(response.data.teamMembers);
      } else {
        console.error("Unexpected API response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Team
              </h1>
              <button
                onClick={() => setNewTeamModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                New Team Member
              </button>
            </div>
            <TeamTable
              data={teams}
              setData={setTeams}
              setEditTeam={setEditTeam}
              fetchTeams={fetchTeams}
            />
            {editTeam && (
              <EditTeamModal
                team={editTeam}
                setEditTeam={setEditTeam}
                fetchTeams={fetchTeams}
              />
            )}
            {newTeamModalOpen && (
              <NewTeamModal
                setNewTeamModalOpen={setNewTeamModalOpen}
                fetchTeams={fetchTeams}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function NewTeamModal({ setNewTeamModalOpen, fetchTeams }) {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    joiningDate: "",
    leavingDate: "",
    image: null,
    category: "",
    socialMediaLinks: {
      linkedin: "",
      github: "",
    },
  });

  const [file, setFile] = useState(null);

  
 
  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "socialMediaLinks") {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      if (file) {
        data.append("image", file);
      }

      const response = await axiosInstance.post("/createTeam", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        fetchTeams(); // Refresh team list
        setNewTeamModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  //new handle change function

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      setFile(files[0]);
    } else if (name.startsWith("socialMediaLinks")) {
      const key = name.split(".")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        socialMediaLinks: { ...prevFormData.socialMediaLinks, [key]: value },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // This handles category correctly
      }));
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">New Team Member</h2>

        <form onSubmit={handleAddTeamMember}>
          <input
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Name"
          />
          <input
            name="designation"
            required
            value={formData.designation}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Designation"
          />
          <input
            type="date"
            required
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            type="date"
            name="leavingDate"
            value={formData.leavingDate}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            type="file"
            required
            onChange={handleChange}
            name="image"
            className="border p-2 w-full mb-2"
            accept="image/*"
          />

          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          >
            <option value="">Select Category</option>
            <option value="advisory">Advisory</option>
            <option value="leadership">Leadership</option>
            <option value="management">Management</option>
          </select>
          <h3 className="text-md font-medium mb-2">Social Media Links</h3>
          <input
            type="text"
            name="socialMediaLinks.linkedin"
            value={formData.socialMediaLinks.linkedin}
            onChange={handleChange}
            required
            className="border p-2 w-full mb-2"
            placeholder="LinkedIn URL"
          />
          <input
            type="text"
            name="socialMediaLinks.github"
            required
            value={formData.socialMediaLinks.github}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="GitHub URL"
          />

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setNewTeamModalOpen(false)}
              className="ml-2 bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
