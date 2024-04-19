import { useNavigate } from "react-router-dom"
import AdminLayout from "../../../layouts/AdminLayout"
import { Suspense, lazy, useState } from "react"
const ListStudent = lazy(() => import("../../../components/student/ListStudents"))
import { useSearchContext } from "../../../hooks/useSearchContext"

const StudentPage = () => {
    const [searchValue, setSearchValue] = useState("")
    const searchContext = useSearchContext()
    const navigate = useNavigate()

    const handleSearch = () => {
        searchContext?.setCateConfigSearch(searchValue)
    }

    return (
        <AdminLayout>
            <div className="mt-5">
                <h3 className="py-4 my-6 text-3xl font-semibold">Sinh viên</h3>

                <div className="bg-white">
                    <div className="flex justify-end p-6">
                        <button
                            type="button"
                            className="focus:outline-none text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            onClick={() => navigate("/management/create/student")}
                        >
                            Tạo mới
                        </button>
                    </div>

                    <div className="flex justify-end pr-6 hidden">
                        <div className="max-w-md min-w-[24rem]">
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input 
                                    type="search" 
                                    id="default-search" 
                                    className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Search Mockups, Logos..." 
                                    required 
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <button type="submit" className="text-white absolute end-1.5 bottom-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>

                    <Suspense fallback={<h1>Loading.....</h1>}>
                        <ListStudent />
                    </Suspense>

                </div>
            </div>
        </AdminLayout>
    )
}

export default StudentPage
