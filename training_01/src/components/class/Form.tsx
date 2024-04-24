import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../../hooks/useSearchContext";
import { requestWithToken } from "../../hooks/useRequest";
import { IClassData, IError } from "../../services/interfaces";

const getClassById = async ({ classId }: { classId: string }) => {
    const res = await requestWithToken({
        url: `v1/builder/form/lop-hoc/data/${classId}`,
        method: "GET",
        typeAuthorized: "Authorization",
    })

    return res.data
}

const FormClass = ({ classId }: { classId?: string }) => {
    const [isLoading, setIsLoading] = useState(classId ? true : false)
    const searchContext = useSearchContext()
    const navigate = useNavigate()
    const [classInfo, setClassInfo] = useState({
        maLop: "",
        tenLop: "",
        moTa: ""
    })
    const [isError, setIsError] = useState({
        state: false,
        messages: {
            maLop: "",
            tenLop: ""
        }
    })

    useEffect(() => {
        searchContext?.setClassSearch("")
    }, [])

    useEffect(() => {
        if (classId) {
            const getData = async () => {
                try {
                    const data: IClassData = await getClassById({ classId })
                    setClassInfo({
                        maLop: data.maLop,
                        moTa: data.moTa,
                        tenLop: data.tenLop
                    })
                    setIsLoading(false)
                } catch (error) {
                    setIsLoading(false)
                    if((error as IError).response.status === 401) {
                        navigate("/auth/login")
                    }
                }
            }
            getData()
        }
    }, [classId, navigate])


    const handleCreate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (classInfo.maLop && classInfo.tenLop) {
            try {
                e.preventDefault()
                await requestWithToken({
                    url: "v1/builder/form/lop-hoc/data",
                    method: "POST",
                    typeAuthorized: "Authorization",
                    body: classInfo
                })

                navigate("/administrator/builder/data/lop-hoc.html")
            } catch (error) {
                if ((error as IError).response.status === 400) {
                    setIsError({
                        state: true,
                        messages: {
                            maLop: "Mã lớp bị trùng",
                            tenLop: ""
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
                    maLop: !classInfo.maLop ? "Mã lớp bị trống" : "",
                    tenLop: !classInfo.tenLop ? "Tên lớp bị trống" : ""
                }
            })
        }
    }

    const handleUpdate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (classInfo.maLop && classInfo.tenLop) {
            try {
                e.preventDefault()
                await requestWithToken({
                    url: "v1/builder/form/lop-hoc/data",
                    method: "PUT",
                    typeAuthorized: "Authorization",
                    body: { ...classInfo, id: Number(classId) }
                })

                navigate("/administrator/builder/data/lop-hoc.html")
            } catch (error) {
                if ((error as IError).response.status === 400) {
                    setIsError({
                        state: true,
                        messages: {
                            maLop: "Mã lớp bị trùng",
                            tenLop: ""
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
                    maLop: !classInfo.maLop ? "Mã lớp bị trống" : "",
                    tenLop: !classInfo.tenLop ? "Tên lớp bị trống" : ""
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
                    <label htmlFor="maLop" className="block mb-2 text-sm font-medium text-gray-900 ">Mã lớp</label>
                    <input
                        type="text"
                        id="maLop"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Tên lớp"
                        required
                        value={classInfo.maLop}
                        onChange={(e) => setClassInfo({
                            ...classInfo,
                            maLop: e.target.value
                        })}
                    />
                    {isError.state && isError.messages.maLop ? <p className="text-sm text-red-500">{isError.messages.maLop}</p> : ""}
                </div>
                <div className="w-full">
                    <label htmlFor="tenLop" className="block mb-2 text-sm font-medium text-gray-900">Tên lớp</label>
                    <input
                        type="text"
                        id="thamSo"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        value={classInfo.tenLop}
                        onChange={(e) => setClassInfo({
                            ...classInfo,
                            tenLop: e.target.value
                        })}
                    />
                    {isError.state && isError.messages.tenLop ? <p className="text-sm text-red-500">{isError.messages.tenLop}</p> : ""}
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Mô tả</label>
                <textarea
                    id="message"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave a comment..."
                    onChange={(e) => setClassInfo({
                        ...classInfo,
                        moTa: e.target.value
                    })}
                >{classInfo.moTa}</textarea>
            </div>
            <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={(e) => classId ? handleUpdate(e) : handleCreate(e)}
            >
                {classId ? "Cập nhập" : "Tạo mới"}
            </button>
            <button
                className="text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yebg-yellow-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ml-2"
                onClick={() => navigate("/administrator/builder/data/lop-hoc.html")}
            >
                Huỷ
            </button>
        </div>

    )
}

export default FormClass