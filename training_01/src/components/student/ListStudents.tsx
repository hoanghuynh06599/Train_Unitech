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

const getStudent = async ({ query }: { query?: string }) => {
    const token = document.cookie.split("=")[1]
    const res = await axios.get(`v1/builder/form/sinh-vien/data${query ? `?name=${query}` : ""}`, {
        headers: {
            token: `Bearer ${token}`
        }
    })
    if (!res.data.data) {
        throw new Error("Can not get student")
    }

    return res.data.data
}

const StudentPage = () => {
    const navigate = useNavigate()
    const [studentData, setStudentData] = useState([])
    const searchContext = useSearchContext()
    const [countReload, setCountReload] = useState(0)

    useEffect(() => {
        const getData = async () => {
            const data = await getStudent({ query: searchContext?.cateConfigSearch })
            setStudentData(data)
        }
        getData()
    }, [searchContext?.cateConfigSearch, countReload])


    const handleDelete = async ({ studentId }: { studentId: string }) => {
        if (confirm(`Bạn muốn xoá học sinh này chứ ?`)) {
            const token = document.cookie.split("=")[1]
            const res = await axios.delete(`v1/builder/form/sinh-vien/data`, {
                data: [studentId],
                headers: {
                    token: `Bearer ${token}`
                }
            })
            if (!res.data) {
                throw new Error("Can not delete class")
            }
            setCountReload(countReload + 1)
            return res.data
        }
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-6 mt-4">
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
                            Mô tả
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        studentData.map((student: IData) => (
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
                                <td className="px-6 py-4">
                                    {student.moTa}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <span
                                        className="cursor-pointer font-medium text-blue-600 hover:underline"
                                        onClick={() => navigate(`/management/edit/student/${student.id}`)}
                                    >
                                        Edit
                                    </span>
                                    <span
                                        className="cursor-pointer font-medium text-red-600 hover:underline"
                                        onClick={() => handleDelete({ studentId : student.id })}
                                    >
                                        Remove
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default StudentPage
