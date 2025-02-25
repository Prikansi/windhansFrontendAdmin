import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import JobApplyTable from "./JobApplyTable"; // Import the JobApplyTable component

export default function JobApply() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Job Application
          </h1>

          {/* Job Applications Table */}
          <JobApplyTable />
        </main>
      </div>
    </div>
  );
}
