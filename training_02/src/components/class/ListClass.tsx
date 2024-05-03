import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchContext } from "../../hooks/useSearchContext"
import { requestWithToken } from "../../hooks/useRequest"
import {  IClassData, IError, IPaging } from "../../services/interfaces"
import { range } from "../../utils/commonUtils"

export const getClass = async ({ query, page, limit = 1000 }: { query?: string, page: number, limit?: number }) => {
    const res = await requestWithToken({
        url: `v1/builder/form/lop-hoc/data?page=${page}&pageSize=${limit}&tenLop_like=${query ?? ""}`,
        method: "GET",
        typeAuthorized: "Authorization",
    })

    if (!res.data) {
        throw new Error("Can not get class")
    }
    return res
}

const ClassPage = () => {
    const navigate = useNavigate()
    const [classData, setClassData] = useState([])
    const searchContext = useSearchContext()
    const [paging, setPaging] = useState<IPaging>()
    const [currPage, setCurrPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true)
                const data = await getClass({ query: searchContext?.classSearch, page: currPage, limit: 5 })
                setPaging({
                    allowNext: data?.pagination?.allowNext,
                    allowPrev: data?.pagination?.allowPrev,
                    page: data?.pagination?.page,
                    totalPage: Math.ceil(data?.pagination?.total / data?.pagination?.pageSize)
                })
                setClassData(data.data)
                setIsLoading(false)

            } catch (error) {
                setIsLoading(false)
                if ((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
            }
        }
        getData()
    }, [searchContext?.classSearch, currPage])


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


    const handleDelete = async ({ classId }: { classId: string }) => {
        if (confirm(`Bạn muốn xoá lớp này chứ ?`)) {
            try {
                const res = await requestWithToken({
                    url: `v1/builder/form/lop-hoc/data`,
                    method: "DELETE",
                    typeAuthorized: "Authorization",
                    body: [classId]
                })

                if (!res.status) {
                    throw new Error("Can not delete class")
                }

                setCurrPage(1)
            } catch (error) {
                if ((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
            }
        }
    }

    if (isLoading) return <h1>Loading....</h1>

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
                        classData?.map((classValue: IClassData) => (
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
                                        onClick={() => navigate(`/administrator/builder/data/edit/class/${classValue.id}`)}
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
            <nav aria-label="Page navigation example " className="mt-4 pb-10">
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

export default ClassPage