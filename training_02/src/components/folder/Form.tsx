import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../../hooks/useSearchContext";
import { requestWithToken } from "../../hooks/useRequest";
import { IError, IFolderData, IFolderError } from "../../services/interfaces";

const getFolderById = async ({ folderId }: { folderId: string }) => {
    const res = await requestWithToken({
        url: `v1/folder/${folderId}`,
        method: "GET",
        typeAuthorized: "Authorization",
    })

    return res.data
}

const FormFolder = ({ folderId }: { folderId?: string }) => {
    const [isLoading, setIsLoading] = useState(folderId ? true : false)
    const searchContext = useSearchContext()
    const navigate = useNavigate()
    const [folderInfo, setFolderInfo] = useState({
        name: "",
        sort: 0,
        parentId: 0,
        description: ""
    })
    const [isError, setIsError] = useState({
        state: false,
        messages: {
            name: "",
            description: ""
        }
    })

    useEffect(() => {
        searchContext?.setFolderSearch("")
    }, [])

    useEffect(() => {
        if (folderId) {
            const getData = async () => {
                try {
                    const data: IFolderData = await getFolderById({ folderId })
                    setFolderInfo({
                        name: data.name,
                        sort: Number(data.sort),
                        parentId: data?.parent ? Number(data.parent.id) : 0,
                        description: data.description
                    })
                    setIsLoading(false)
                } catch (error) {
                    setIsLoading(false)
                    if ((error as IFolderError).status === 401) {
                        navigate("/auth/login")
                    }
                }
            }
            getData()
        }
    }, [folderId, navigate])


    const handleCreate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (folderInfo.name && folderInfo.sort && folderInfo.description) {
            try {
                e.preventDefault()
                await requestWithToken({
                    url: "v1/folder",
                    method: "POST",
                    typeAuthorized: "Authorization",
                    body: folderInfo
                })

                navigate("/administrator/internship/builder/folder.html")
            } catch (error) {
                if ((error as IError).response.status === 400) {
                    setIsError({
                        state: true,
                        messages: {
                            name: "Tên thư mục bị trùng",
                            description: ""
                        }
                    })
                } else if ((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
            }
        } else {
            setIsError({
                state: true,
                messages: {
                    name: !folderInfo.name ? "Tên thư mục bị trống" : "",
                    description: !folderInfo.description ? "Mô tả thư mục bị trống" : ""
                }
            })
        }
    }

    const handleUpdate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (folderInfo.name && folderInfo.sort && folderInfo.description) {
            try {
                e.preventDefault()
                await requestWithToken({
                    url: "v1/folder",
                    method: "PUT",
                    typeAuthorized: "Authorization",
                    body: {
                        id: Number(folderId),
                        parent: folderInfo.parentId !== 0 ? { id: folderInfo.parentId } : null,
                        name: folderInfo.name,
                        sort: folderInfo.sort,
                        description: folderInfo.description
                    }
                })

                navigate("/administrator/internship/builder/folder.html")
            } catch (error) {
                if ((error as IFolderError).status === 400) {
                    setIsError({
                        state: true,
                        messages: {
                            name: "Tên thư mục bị trùng",
                            description: ""
                        }
                    })
                } else if((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
            }
        } else {
            setIsError({
                state: true,
                messages: {
                    name: !folderInfo.name ? "Tên thư mục bị trống" : "",
                    description: !folderInfo.description ? "Mô tả thư mục bị trống" : ""
                }
            })
        }
    }

    if (isLoading) {
        return <h1>Loading.....</h1>
    }

    return (
        <div>
            <div className="flex gap-5 mb-5 w-full">
                <div className="w-full">
                    <label htmlFor="maLop" className="block mb-2 text-sm font-medium text-gray-900 ">Tên thư mục</label>
                    <input
                        type="text"
                        id="maLop"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Tên thư mục"
                        required
                        value={folderInfo.name}
                        onChange={(e) => setFolderInfo({
                            ...folderInfo,
                            name: e.target.value
                        })}
                    />
                    {isError.state && isError.messages.name ? <p className="text-sm text-red-500">{isError.messages.name}</p> : ""}
                </div>
                <div className="w-full">
                    <label htmlFor="tenLop" className="block mb-2 text-sm font-medium text-gray-900">Sắp xếp</label>
                    <input
                        type="text"
                        id="thamSo"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        value={folderInfo.sort}
                        onChange={(e) => setFolderInfo({
                            ...folderInfo,
                            sort: Number(e.target.value)
                        })}
                    />

                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Mô tả</label>
                <textarea
                    id="message"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave a comment..."
                    onChange={(e) => setFolderInfo({
                        ...folderInfo,
                        description: e.target.value
                    })}
                    value={folderInfo.description}
                ></textarea>
                {isError.state && isError.messages.description ? <p className="text-sm text-red-500">{isError.messages.description}</p> : ""}
            </div>
            <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={(e) => folderId ? handleUpdate(e) : handleCreate(e)}
            >
                {folderId ? "Cập nhập" : "Tạo mới"}
            </button>
            <button
                className="text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yebg-yellow-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ml-2"
                onClick={() => navigate("/administrator/internship/builder/folder.html")}
            >
                Huỷ
            </button>
        </div>

    )
}

export default FormFolder