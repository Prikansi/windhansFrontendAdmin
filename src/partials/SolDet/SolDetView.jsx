// "use client"

// import { useState, useEffect } from "react"
// import axiosInstance from "../../api/Axios"

// export default function SolDetView({ solution, setViewSolution }) {
//   const [solutionData, setSolutionData] = useState(solution)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   // Fetch solution details by ID when component mounts
//   useEffect(() => {
//     const fetchSolutionById = async () => {
//       if (!solution?.id) return

//       setLoading(true)
//       setError("")

//       try {
//         const response = await axiosInstance.get(`/solDetailById/${solution.id}`)
//         if (response.data) {
//           setSolutionData(response.data)
//         }
//       } catch (error) {
//         console.error("Error fetching solution details:", error)
//         setError("Failed to load solution details. Please try again.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSolutionById()
//   }, [solution?.id])

//   // Parse screenshots if they exist
//   let screenshots = []
//   try {
//     screenshots = solutionData?.screenshot ? JSON.parse(solutionData.screenshot) : []
//   } catch (error) {
//     console.error("Error parsing screenshots:", error)
//   }

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//         <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
//         {error ? (
//           <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
//             {error}
//             <button onClick={() => setViewSolution(null)} className="ml-2 underline">
//               Close
//             </button>
//           </div>
//         ) : (
//           <>
//             <h2 className="text-xl font-semibold mb-4">{solutionData?.title}</h2>

//             <div className="mb-4">
//               <h3 className="font-medium text-gray-700">Domaineee</h3>
//               <p className="text-gray-600">{solutionData?.domain}</p>
//             </div>

//             <div className="mb-4">
//               <h3 className="font-medium text-gray-700">Description</h3>
//               <p className="text-gray-600">{solutionData?.description}</p>
//             </div>

//             {solutionData?.content && (
//               <div className="mb-4">
//                 <h3 className="font-medium text-gray-700">content</h3>
//                 <p className="text-gray-600">{solutionData.content}</p>
//               </div>
//             )}

          

//             {screenshots.length > 0 && (
//               <div className="mb-4">
//                 <h3 className="font-medium text-gray-700 mb-2">Screenshots</h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   {screenshots.map((imgPath, index) => (
//                     <img
//                       key={index}
//                       src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/${imgPath}`}
//                       alt={`Screenshot ${index + 1}`}
//                       className="rounded-md w-full h-auto object-cover"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         <div className="flex justify-end mt-4">
//           <button onClick={() => setViewSolution(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

