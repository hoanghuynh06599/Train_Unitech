import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchContext } from "../../hooks/useSearchContext"

interface IData {
    id: string
    maLop: string,
    tenLop: string,
    moTa: string
}

const getClass = async ({ query }: { query?: string }) => {
    const token = document.cookie.split("=")[1]
    const res = await axios.get(`v1/builder/form/lop-hoc/data${query ? `?name=${query}` : ""}`, {
        headers: {
            token: `Bearer ${token}`
        }
    })
    if (!res.data) {
        throw new Error("Can not get class")
    }

    return res.data.data
}

const ClassPage = () => {
    const navigate = useNavigate()
    const [classData, setClassData] = useState([])
    const searchContext = useSearchContext()
    const [countReload, setCountReload] = useState(0)

    useEffect(() => {
        const getData = async () => {
            const data = await getClass({ query: searchContext?.cateConfigSearch })
            setClassData(data)
        }
        getData()
    }, [searchContext?.cateConfigSearch, countReload])


    const handleDelete = async ({ classId }: { classId: string }) => {
        if (confirm(`Bạn muốn xoá lớp này chứ ?`)) {
            const token = document.cookie.split("=")[1]
            const res = await axios.delete(`v1/builder/form/lop-hoc/data`, {
                data: [classId],
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
                            Mã lớp
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tên Lớp
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
                        classData.map((classValue: IData) => (
                            <tr className="odd:bg-white even:bg-gray-50 border-b" key={classValue.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {classValue.id}
                                </th>
                                <td className="px-6 py-4">
                                    {classValue.maLop}
                                </td>
                                <td className="px-6 py-4">
                                    {classValue.tenLop}
                                </td>
                                <td className="px-6 py-4">
                                    {classValue.moTa}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <span
                                        className="cursor-pointer font-medium text-blue-600 hover:underline"
                                        onClick={() => navigate(`/management/edit/class/${classValue.id}`)}
                                    >
                                        Edit
                                    </span>
                                    <span
                                        className="cursor-pointer font-medium text-red-600 hover:underline"
                                        onClick={() => handleDelete({ classId: classValue.id })}
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

export default ClassPage