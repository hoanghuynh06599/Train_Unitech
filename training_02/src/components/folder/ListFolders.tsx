import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchContext } from "../../hooks/useSearchContext"
import { requestWithToken } from "../../hooks/useRequest"
import { IFolderData, IFolderError, IPaging } from "../../services/interfaces"
import { range } from "../../utils/commonUtils"

export const getFolders = async ({ query, page, limit = 5, parentSearch }: { query?: string, page: number, limit?: number, parentSearch?: string }) => {
    const res = await requestWithToken({
        url: `v1/folder?page=${page}&pageSize=${limit}&name_like=${query}&parent=${parentSearch}`,
        method: "GET",
        typeAuthorized: "Authorization",
    })

    if (!res.data) {
        throw new Error("Can not get student")
    }

    return res
}

const ListFolder = () => {
    const navigate = useNavigate()
    const [folderData, setFolderData] = useState([])
    const searchContext = useSearchContext()
    const [paging, setPaging] = useState<IPaging>()
    const [currPage, setCurrPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)
            try {
                setFolderData([])
                const data = await getFolders({ query: searchContext?.folderSearch, page: currPage, parentSearch: searchContext?.folderSearchByParent })
                setPaging({
                    allowNext: data?.pagination?.allowNext,
                    allowPrev: data?.pagination?.allowPrev,
                    page: data?.pagination?.page,
                    totalPage: Math.ceil(data?.pagination?.total / data?.pagination?.pageSize)
                })

                setFolderData(data.data)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                if ((error as IFolderError).status === 401) {
                    navigate("/auth/login")
                }
            }
        }
        getData()
    }, [searchContext?.folderSearch, searchContext?.folderSearchByParent, currPage, navigate])

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

    const handleDelete = async ({ folderId }: { folderId: string }) => {
        if (confirm(`Bạn muốn xoá thư mục này chứ ?`)) {
            const listDelete: string[] = [folderId]
            const listChilds = await requestWithToken({
                url: `v1/folder?parent=${folderId}`,
                method: "GET",
                typeAuthorized: "Token"
            })

            listChilds.data.forEach((child: { id: string }) => {
                listDelete.push(child.id)
            })

            try {
                const res = await requestWithToken({
                    url: `v1/folder`,
                    method: "DELETE",
                    typeAuthorized: "Token",
                    body: listDelete
                })

                if (!res.status) {
                    throw new Error("Can not delete folder")
                }

                setCurrPage(1)
                return res.data
            } catch (error) {
                if((error as IFolderError).status === 401) {
                    navigate("/auth/login")
                }
            }
        }
    }

    if (isLoading) return <h1>Loading....</h1>

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg pr-6 mt-4 pb-10 flex-1">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tên thư mục
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tên thư mục cha
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        folderData?.map((folder: IFolderData) => (
                            <tr className="odd:bg-white even:bg-gray-50 border-b" key={folder.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {folder.id}
                                </th>
                                <td className="px-6 py-4">
                                    {folder.name}
                                </td>
                                <td className="px-6 py-4">
                                    {folder.parent?.name ?? "-:-"}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <span
                                        className="cursor-pointer font-medium text-blue-600 hover:underline"
                                        onClick={() => navigate(`/administrator/builder/data/edit/folder/${folder.id}`)}
                                    >
                                        Edit
                                    </span>
                                    <span
                                        className="cursor-pointer font-medium text-red-600 hover:underline"
                                        onClick={() => handleDelete({ folderId: folder.id })}
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

export default ListFolder
