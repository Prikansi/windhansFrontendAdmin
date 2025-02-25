import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import axiosInstance from "../../api/Axios";
import { BlogTable } from "./blog-table";
import EditBlogModal from "./EditBlogModal";

export default function Blog() {
  const [data, setData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [newBlogModalOpen, setNewBlogModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // Default sorting field
  const [sortOrder, setSortOrder] = useState("desc"); // Default sorting order

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get(
        `/blogList?page=${
          pageIndex + 1
        }&limit=${pageSize}&search=${searchQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (response.status === 200) {
        setData(response.data.blogs);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  console.log("Blogs from API:", data);


  useEffect(() => {
    fetchBlogs(); // Fetch blogs on component mount
    console.log("Blogs from API:", data);
  }, [pageIndex, pageSize, searchQuery, sortBy, sortOrder]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Blog
              </h1>
              <button
                onClick={() => setNewBlogModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                New Blog
              </button>
            </div>
            <BlogTable
              data={data}
              setData={setData}
              setEditBlog={setEditBlog}
              fetchBlogs={fetchBlogs}
              totalCount={totalCount}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            {editBlog && (
              <EditBlogModal
                blog={editBlog}
                setEditBlog={setEditBlog}
                setBlogs={setData}
                fetchBlogs={fetchBlogs}
              />
            )}
            {newBlogModalOpen && (
              <NewBlogModal
                setNewBlogModalOpen={setNewBlogModalOpen}
                setBlogs={setData}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function NewBlogModal({ setNewBlogModalOpen, setBlogs }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    description: "",
    views: "",
    date: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (file) {
        data.append("image", file);
      }

      const response = await axiosInstance.post("/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        const newBlog = response.data.blog || response.data; // Adjust based on API response

        setBlogs((prevBlogs) => [...prevBlogs, newBlog]); // Update UI immediately
        setNewBlogModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">New Blog</h2>

        {/* Wrap Inputs Inside a Form */}
        <form onSubmit={handleAddBlog}>
          <input
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Title"
          />
          <input
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Category"
          />
          <input
            name="author"
            required
            value={formData.author}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Author"
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
            type="number"
            required
            name="views"
            value={formData.views}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Views"
          />
          <input
            type="date"
            required
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            type="file"
            required
            onChange={handleFileChange}
            className="border p-2 w-full mb-2"
            accept="image/*"
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
              onClick={() => setNewBlogModalOpen(false)}
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
