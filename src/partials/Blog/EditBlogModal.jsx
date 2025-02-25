import { useState } from "react"
import axiosInstance from "../../api/Axios"

export default function EditBlogModal({ blog, setEditBlog, setBlogs,fetchBlogs }) {
  const [formData, setFormData] = useState({ ...blog })
  const [file, setFile] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (file) {
        data.append("image", file);
      }
  
      const response = await axiosInstance.put(`/updateBlog/${blog.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        setEditBlog(null);
        fetchBlogs(); // Refetch latest blogs to update UI
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Blog</h2>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Title"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Category"
        />

        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Author"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Description"
          rows="3"
        ></textarea>

        <input
          type="number"
          name="views"
          value={formData.views}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Views"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <input type="file" onChange={handleFileChange} className="border p-2 w-full mb-2" accept="image/*" />

        <div className="flex justify-end mt-4">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={() => setEditBlog(null)} className="ml-2 bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

