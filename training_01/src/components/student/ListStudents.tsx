import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchContext } from "../../hooks/useSearchContext"

interface IData {
    id: string
    maSinhVien: string,
    tenSinhVien: string,
    moTa: string
}

interface IError {
    response: {
        status: number
    }
}

interface IPaging {
    page: number
    totalPage: number,
    allowNext: boolean,
    allowPrev: boolean,

}

const range = ({ size }: { size?: number }) => {
    if (size) {
        const itemsInRange = []
        for (let i = 1; i <= size; i++) {
            itemsInRange.push(i)
        }
        return itemsInRange
    }
}

const getStudent = async ({ query, page }: { query?: string, page: number }) => {
    const token = localStorage.getItem('token')
    const res = await axios.get(`v1/builder/form/sinh-vien/data?page=${page}&pageSize=5&tenSinhVien_like=${query ?? ""}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.data.data) {
        throw new Error("Can not get student")
    }

    return res.data
}

const StudentPage = () => {
    const navigate = useNavigate()
    const [studentData, setStudentData] = useState([])
    const searchContext = useSearchContext()
    const [countReload, setCountReload] = useState(0)
    const [paging, setPaging] = useState<IPaging>()
    const [currPage, setCurrPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)
            try {
                setStudentData([])
                const data = await getStudent({ query: searchContext?.studentSearch, page: currPage })
                setPaging({
                    allowNext: data?.pagination?.allowNext,
                    allowPrev: data?.pagination?.allowPrev,
                    page: data?.pagination?.page,
                    totalPage: Math.ceil(data?.pagination?.total / data?.pagination?.pageSize)
                })
                setStudentData(data.data)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                if((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
            }
        }
        getData()
    }, [searchContext?.studentSearch, countReload, currPage])

    const handleSetPage = ({ page }: { page: number }) => {
        let direction;

        if (currPage < page) {
            direction = 'next'
        } else if (currPage > page) {
            direction = 'prev'
        }

        if (direction === 'next') {
            if (paging?.allowNext) {
                setCurrPage(page)
            }
        } else if (direction === 'prev') {
            if (paging?.allowPrev) {
                setCurrPage(page)
            }
        }
    }

    const handleDelete = async ({ studentId }: { studentId: string }) => {
        if (confirm(`Bạn muốn xoá học sinh này chứ ?`)) {
            const token = localStorage.getItem('token')
            try {
                const res = await axios.delete(`v1/builder/form/sinh-vien/data`, {
                    data: [studentId],
                    headers: {
                        Token: `Bearer ${token}`
                    }
                })
                setCountReload(countReload + 1)
                return res.data
            } catch (error) {
                if((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
            }
        }
    }

    if(isLoading) return <h1>Loading....</h1>

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-6 mt-4 pb-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Mã sinh viên
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tên sinh viên
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        studentData?.map((student: IData) => (
                            <tr className="odd:bg-white even:bg-gray-50 border-b" key={student.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {student.id}
                                </th>
                                <td className="px-6 py-4">
                                    {student.maSinhVien}
                                </td>
                                <td className="px-6 py-4">
                                    {student.tenSinhVien}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <span
                                        className="cursor-pointer font-medium text-blue-600 hover:underline"
                                        onClick={() => navigate(`/administrator/builder/data/edit/student/${student.id}`)}
                                    >
                                        Edit
                                    </span>
                                    <span
                                        className="cursor-pointer font-medium text-red-600 hover:underline"
                                        onClick={() => handleDelete({ studentId: student.id })}
                                    >
                                        Remove
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <nav aria-label="Page navigation example " className="mt-4">
                <ul className="inline-flex -space-x-px text-sm">
                    <li onClick={() => handleSetPage({ page: currPage - 1 })}>
                        <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">Previous</a>
                    </li>
                    {
                        range({ size: paging?.totalPage })?.map(page => (
                            <li key={page} onClick={() => handleSetPage({ page })}>
                                <a href="#" className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
                                ${page === currPage ? "bg-gray-100 text-gray-700" : "bg-white text-gray-500 "}`}
                                >{page}</a>
                            </li>
                        ))
                    }
                    <li onClick={() => handleSetPage({ page: currPage + 1 })}>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default StudentPage
