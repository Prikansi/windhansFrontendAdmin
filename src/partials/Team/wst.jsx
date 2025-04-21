import { useEffect, useState } from "react";
import axiosInstance from "../../api/Axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { FaTrashAlt } from "react-icons/fa";
import { FaPencilRuler, FaPlus } from "react-icons/fa";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    joiningDate: "",
    leavingDate: "",
    image: "",
    socialMediaLinks: {
      linkedin: "",
      github: "",
    },
  });

  useEffect(() => {
    axiosInstance
      .get("/listAllTeamMember")
      .then((response) => {
        const teamData = response.data.teamMembers.map((member) => ({
          ...member,
          socialMediaLinks: member.socialMediaLinks
            ? JSON.parse(member.socialMediaLinks)
            : {},
        }));
        console.log(teamData); // Check if socialMediaLinks are parsed correctly
        setTeam(teamData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching team data");
        setLoading(false);
      });
  }, []);

  console.log(team);
  const handleAddNew = () => {
    setAddingMember(true);
    setFormData({
      name: "",
      designation: "",
      joiningDate: "",
      leavingData: "",
      image: "",
      socialMediaLinks: { linkedin: "", github: "" },
    });
  };

  //Create team
  const handleCreate = () => {
    const formDataToSend = new FormData();

    for (const key in formData) {
      if (key === "socialMediaLinks") {
        // Ensure the socialMediaLinks are stringified in the correct format
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === "image" && formData[key] instanceof File) {
        formDataToSend.append("image", formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    axiosInstance
      .post("/createTeam", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setTeam([...team, response.data.teamMember]);
        setAddingMember(false);
      })
      .catch((err) => {
        console.error("Error creating member:", err);
      });
  };

  // Update team member
  const handleUpdate = (id) => {
    const formDataToSend = new FormData();

    for (const key in formData) {
      if (key === "socialMediaLinks") {
        // Ensure the socialMediaLinks are stringified in the correct format
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === "image" && formData[key] instanceof File) {
        formDataToSend.append("image", formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    axiosInstance
      .put(`updateMember/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setTeam(
          team.map((member) =>
            member.id === id ? { ...member, ...formData } : member
          )
        );
        setEditingMember(null); // Close the form
      })
      .catch((err) => {
        console.error("Error updating member:", err);
      });
  };

  const handleDelete = (id) => {
    axiosInstance
      .delete(`/deleteMember/${id}`)
      .then((response) => {
        setTeam(team.filter((member) => member.id !== id));
      })
      .catch((err) => {
        console.log("Error deleting member:", err);
      });
  };

  const handleFormChange = (e) => {
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
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const openEditForm = (member) => {
    setEditingMember(member.id);
    setFormData({
      name: member.name,
      designation: member.designation,
      joiningDate: member.joiningDate,
      leavingDate: member.leavingDate || "",
      image: member.image,
      socialMediaLinks: member.socialMediaLinks || { linkedin: "", github: "" },
    });
  };

  const closeEditForm = () => {
    setEditingMember(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (team.length === 0) return <div>No team members found.</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="grow overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl md:text-2xl font-semibold">Team</h1>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <FaPlus /> Add New
              </button>
            </div>

            {/* Responsive Wrapper */}
            <div className="rounded-md border mt-4 max-h-[500px] overflow-y-auto overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-[80px_minmax(150px,1fr)_minmax(150px,1fr)_150px_150px_minmax(200px,1fr)_150px] items-center border-b px-3 py-2 text-sm font-medium">
                <div></div>
                <div>NAME</div>
                <div>DESIGNATION</div>
                <div>JOINING DATE</div>
                <div>LEAVING DATE</div>
                <div>SOCIAL MEDIA</div>
                <div className="">ACTIONS</div>
              </div>

              {/* Team Members List */}
              {team.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-[80px_minmax(150px,1fr)_minmax(150px,1fr)_150px_150px_minmax(200px,1fr)_150px] items-center border-b px-3 py-2 min-h-[50px] hover:bg-muted/50"
                >
                  {/* <img
                    src={row.original.image ? `http://localhost:4000/${row.original.image}` : "/placeholder.svg"}
                    alt={row.getValue("title")}
                    className="h-12 w-12 rounded-md object-cover"
                  /> */}
                  <div>
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {member.image ? (
                        <img
                          src={
                            member.image
                              ? `http://localhost:4000/${member.image}`
                              : "/placeholder.svg"
                          }
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">
                          {member.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-medium text-sm">
                    {member.name || "No Name"}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {member.designation || "No Designation"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.joiningDate
                      ? new Date(member.joiningDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.leavingDate
                      ? new Date(member.leavingDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="flex gap-2 text-sm">
                    {member.socialMediaLinks?.linkedin && (
                      <a
                        href={member.socialMediaLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.socialMediaLinks?.github && (
                      <a
                        href={member.socialMediaLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        GitHub
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2 text-sm">
                    {/* Update Button */}
                    <button
                      onClick={() => openEditForm(member)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center"
                    >
                      <FaPencilRuler />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center"
                    >
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Member Modal */}
            {addingMember && (
              <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
                  <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreate();
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
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
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2">Joining Date</label>
                        <input
                          type="date"
                          name="joiningDate"
                          value={formData.joiningDate}
                          onChange={handleFormChange}
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
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2">Profile Image</label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFormChange}
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
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">GitHub</label>
                        <input
                          type="text"
                          name="socialMediaLinks.github"
                          value={formData.socialMediaLinks.github}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingMember(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {editingMember && (
              <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
                  <h2 className="text-xl font-semibold mb-4">Update Member</h2>
                  <form onSubmit={() => handleUpdate(editingMember)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">Designation</label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2">Joining Date</label>
                        <input
                          type="date"
                          name="joiningDate"
                          value={formData.joiningDate}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">Leaving Date</label>
                        <input
                          type="date"
                          name="leavingDate"
                          value={formData.leavingDate}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2">Profile Image</label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFormChange}
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
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">GitHub</label>
                        <input
                          type="text"
                          name="socialMediaLinks.github"
                          value={formData.socialMediaLinks.github}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={closeEditForm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
