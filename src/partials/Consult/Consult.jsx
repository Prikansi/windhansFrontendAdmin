import React,{useState} from 'react'
import Sidebar from "../Sidebar";
import Header from "../Header";
import ConsultTable from "./ConsultTable";

export default function Consult() {
     const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow overflow-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                   Consultation details
                  </h1>
        
                  {/* Job Applications Table */}
                  <ConsultTable />
                </main>
      </div>
    </div>
  )
}
