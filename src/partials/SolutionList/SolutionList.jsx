import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { SolutionListTable } from "./SolutionListTable";
import axiosInstance from "../../api/Axios";
import SolutionListEdit from "./SolutionListEdit";

export default function SolutionList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newSolListOpen, setNewSolListOpen] = useState(false);
  const [solution, setSolution] = useState([]);
  const [editSolution, setEditSolution] = useState(null);

  const fetchSolutions = async () => {
    try {
      const response = await axiosInstance.get("/getSolutionList");
      if (response.status === 200) {
        setSolution(response.data.solution);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching solutions:", error);
    }
  };

  useEffect(() => {
    fetchSolutions();
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
                Solution List
              </h1>
              <button
                onClick={() => setNewSolListOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                New Solution
              </button>
            </div>

            {newSolListOpen && (
              <NewSolutionModal
                setNewSolListOpen={setNewSolListOpen}
                fetchSolutions={fetchSolutions}
              />
            )}

            <SolutionListTable
              data={solution || []}
              setEditSolution={setEditSolution}
              fetchSolutions={fetchSolutions}
            />

            {editSolution && (
              <SolutionListEdit
                solution={editSolution}
                setEditSolution={setEditSolution}
                fetchSolutions={fetchSolutions}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function NewSolutionModal({ setNewSolListOpen, fetchSolutions }) {
  const [formData, setFormData] = useState({ title: "", domain: "", description: "" });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddSolution = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (file) {
        data.append("image", file);
      }

      const response = await axiosInstance.post("/addSolutionList", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        fetchSolutions();
        setNewSolListOpen(false);
      }
    } catch (error) {
      console.error("Error adding solution:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-lg font-semibold mb-4">New Solution</h2>
        <form onSubmit={handleAddSolution}>
          <input
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Title"
          />
          <input
            name="domain"
            required
            value={formData.domain}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Domain"
          />
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Description"
            rows="3"
          ></textarea>
          <input
            type="file"
            required
            onChange={handleFileChange}
            className="border p-2 w-full mb-2"
            accept="image/*"
          />
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setNewSolListOpen(false)} className="ml-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
