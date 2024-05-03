import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../../hooks/useSearchContext";
import { requestWithToken } from "../../hooks/useRequest";
import { IError, IFolderError, IFormData } from "../../services/interfaces";
import { getFolders } from "../folder/ListFolders";

const getFormById = async ({ formId }: { formId: string }) => {
    const res = await requestWithToken({
        url: `v1/builder/form/${formId}`,
        method: "GET",
        typeAuthorized: "Authorization",
    })

    return res.data
}

const FormForm = ({ formId }: { formId?: string }) => {
    const [isLoading, setIsLoading] = useState(formId ? true : false)
    const [folderData, setFolderData] = useState([])
    const searchContext = useSearchContext()
    const navigate = useNavigate()
    const [formInfo, setFormInfo] = useState({
        name: "",
        code: "",
        folderId: 0,
        checkAccess: true,
        showView: true,
        description: ""
    })
    const [isError, setIsError] = useState({
        state: false,
        messages: {
            name: "",
            code: "",
        }
    })

    useEffect(() => {
        searchContext?.setFormSearch("")
    }, [])

    useEffect(() => {
        const getFolderData = async () => {
            const folderData = await getFolders({ query: "", page: 1, limit: 10000 })
            const listFolderOptions = folderData.data.map((folder: {name: string, id: number}) => {
                return {
                    id: folder.id,
                    name: folder.name
                }
            })
            setFolderData(listFolderOptions)
        }
        getFolderData()
        if (formId) {
            const getData = async () => {
                try {
                    const data: IFormData = await getFormById({ formId })
                    setFormInfo({
                        name: data.name,
                        code: data.code,
                        checkAccess: data.checkAccess,
                        showView: data.showView,
                        folderId: data?.folder ? Number(data.folder.id) : 0,
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
    }, [formId, navigate])


    const handleCreate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (formInfo.name && formInfo.code) {
            try {
                e.preventDefault()
                await requestWithToken({
                    url: "v1/builder/form",
                    method: "POST",
                    typeAuthorized: "Authorization",
                    body: {
                        folder: formInfo.folderId != 0 ? { id: formInfo.folderId } : null,
                        name: formInfo.name,
                        code: formInfo.code,
                        checkAccess: formInfo.checkAccess,
                        showView: formInfo.showView,
                        description: formInfo.description
                    }
                })

                navigate("/administrator/internship/builder/form.html")
            } catch (error) {
                if ((error as IError).response.status === 400) {
                    const messageError = {
                        name: "",
                        code: "",
                    }
                    const fieldsError = error.response.data.errorDescription
                    fieldsError.forEach((item: {field: string}) => {
                        if(item.field === "name") {
                            messageError.name = "Tên form bị trùng"
                        } else if (item.field === "code") {
                            messageError.code = "Code form bị trùng"
                        }
                    })

                    setIsError({
                        state: true,
                        messages: {
                            code: messageError.code,
                            name: messageError.name
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
                    name: !formInfo.name ? "Tên form bị trống" : "",
                    code: !formInfo.code ? "Code form bị trống" : ""
                }
            })
        }
    }

    const handleUpdate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (formInfo.name && formInfo.code) {
            try {
                e.preventDefault()
                await requestWithToken({
                    url: "v1/builder/form",
                    method: "PUT",
                    typeAuthorized: "Authorization",
                    body: {
                        id: Number(formId),
                        folder: formInfo.folderId != 0 ? { id: formInfo.folderId } : null,
                        name: formInfo.name,
                        code: formInfo.code,
                        checkAccess: formInfo.checkAccess,
                        showView: formInfo.showView,
                        description: formInfo.description
                    }
                })

                navigate("/administrator/internship/builder/form.html")
            } catch (error) {
                if ((error as IError).response.status === 400) {
                    const messageError = {
                        name: "",
                        code: "",
                    }
                    const fieldsError = error.response.data.errorDescription
                    fieldsError.forEach((item: {field: string}) => {
                        if(item.field === "name") {
                            messageError.name = "Tên form bị trùng"
                        } else if (item.field === "code") {
                            messageError.code = "Code form bị trùng"
                        }
                    })

                    setIsError({
                        state: true,
                        messages: {
                            code: messageError.code,
                            name: messageError.name
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
                    name: !formInfo.name ? "Tên form bị trống" : "",
                    code: !formInfo.code ? "Code form bị trống" : ""
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
                    <label htmlFor="maLop" className="block mb-2 text-sm font-medium text-gray-900 ">Tên form</label>
                    <input
                        type="text"
                        id="maLop"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Tên form"
                        required
                        value={formInfo.name}
                        onChange={(e) => setFormInfo({
                            ...formInfo,
                            name: e.target.value
                        })}
                    />
                    {isError.state && isError.messages.name ? <p className="text-sm text-red-500">{isError.messages.name}</p> : ""}
                </div>
                <div className="w-full">
                    <label htmlFor="tenLop" className="block mb-2 text-sm font-medium text-gray-900">Code</label>
                    <input
                        type="text"
                        id="thamSo"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        value={formInfo.code}
                        onChange={(e) => setFormInfo({
                            ...formInfo,
                            code: e.target.value
                        })}
                    />
                    {isError.state && isError.messages.code ? <p className="text-sm text-red-500">{isError.messages.code}</p> : ""}
                </div>
            </div>
            <div className="mb-5">
                <div className="flex items-center mb-4">
                    <label htmlFor="default-checkbox-1" className="ms-2 text-sm font-medium text-gray-900 mr-4">Check access</label>
                    <input 
                        id="default-checkbox-1" 
                        type="checkbox" 
                        checked={formInfo.checkAccess}
                        onChange={(e) => setFormInfo({
                            ...formInfo,
                            checkAccess: e.target.checked
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 mr-4">Show view</label>
                    <input 
                        id="default-checkbox-2" 
                        type="checkbox" 
                        checked={formInfo.showView}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" 
                        onChange={(e) => setFormInfo({
                            ...formInfo,
                            showView: e.target.checked
                        })}
                    />
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Thư mục</label>
                <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={e => setFormInfo({
                        ...formInfo,
                        folderId: Number(e.target.value)
                    })}
                >
                    <option >Chọn thư mục</option>
                    {
                        folderData?.map((item: {name: string, id: number}) => (
                            <option
                                value={item.id}
                                key={item.id}
                                selected={item.id === formInfo.folderId}
                            >{item.name}</option>
                        ))
                    }
                </select>
            </div>
            <div className="mb-5">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Mô tả</label>
                <textarea
                    id="message"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave a comment..."
                    onChange={(e) => setFormInfo({
                        ...formInfo,
                        description: e.target.value
                    })}
                    value={formInfo.description}
                ></textarea>
            </div>
            <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={(e) => formId ? handleUpdate(e) : handleCreate(e)}
            >
                {formId ? "Cập nhập" : "Tạo mới"}
            </button>
            <button
                className="text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yebg-yellow-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ml-2"
                onClick={() => navigate("/administrator/internship/builder/form.html")}
            >
                Huỷ
            </button>
        </div>

    )
}

export default FormForm