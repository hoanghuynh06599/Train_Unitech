import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchContext } from "../../hooks/useSearchContext"

interface IData {
    id: string
    ma: string,
    thamSo: string,
    moTa: string
}

const getCategories = async ({ query }: { query?: string }) => {
    const token = localStorage.getItem('token')
    const res = await axios.get(`v1/builder/form/cau-hinh/data${query ? `?name=${query}` : ""}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.data) {
        throw new Error("Can not get categories")
    }

    return res.data.data
}

const ListCategories = () => {
    const navigate = useNavigate()
    const [categoriesData, setCategoriesData] = useState([])
    const searchContext = useSearchContext()
    const [countReload, setCountReload] = useState(0)

    useEffect(() => {
        const getData = async () => {
            const data = await getCategories({ query: searchContext?.cateConfigSearch })
            setCategoriesData(data)
        }
        getData()
    }, [searchContext?.cateConfigSearch, countReload])


    const handleDelete = async ({ cateId }: { cateId: string }) => {
        if (confirm(`Bạn muốn xoá danh mục này chứ ?`)) {
            const token = localStorage.getItem('token')
            const res = await axios.delete(`v1/builder/form/cau-hinh/data`, {
                data: [cateId],
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!res.data) {
                throw new Error("Can not delete categories")
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
                            Mã
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Mô tả
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tham số
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoriesData?.map((cate: IData) => (
                            <tr className="odd:bg-white even:bg-gray-50 border-b" key={cate.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {cate.id}
                                </th>
                                <td className="px-6 py-4">
                                    {cate.ma}
                                </td>
                                <td className="px-6 py-4">
                                    {cate.moTa}
                                </td>
                                <td className="px-6 py-4">
                                    {cate.thamSo}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <span
                                        className="cursor-pointer font-medium text-blue-600 hover:underline"
                                        onClick={() => navigate(`/management/edit/categories-config/${cate.id}`)}
                                    >
                                        Edit
                                    </span>
                                    <span
                                        className="cursor-pointer font-medium text-red-600 hover:underline"
                                        onClick={() => handleDelete({ cateId: cate.id })}
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

export default ListCategories