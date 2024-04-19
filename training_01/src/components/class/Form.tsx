import axios from "axios"
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IData {
    id: string
    maLop: string,
    tenLop: string,
    moTa: string
}


const getClassById = async ({ classId }: { classId: string }) => {
    const token = document.cookie.split("=")[1]
    const res = await axios.get(`v1/builder/form/lop-hoc/data/${classId}`, {
        headers: {
            token: `Bearer ${token}`
        }
    });

    if (!res.data.data) {
        throw new Error("Error when get class by Id")
    }

    return res.data.data
}

const FormClass = ({ classId }: { classId?: string }) => {
    const [isLoading, setIsLoading] = useState(classId ? true : false)
    const navigate = useNavigate()
    const [classInfo, setClassInfo] = useState({
        maLop: "",
        tenLop: "",
        moTa: ""
    })

    useEffect(() => {
        if (classId) {
            const getData = async () => {
                const data: IData = await getClassById({ classId })
                setClassInfo({
                    maLop: data.maLop,
                    moTa: data.moTa,
                    tenLop: data.tenLop
                })
                setIsLoading(false)
            }
            getData()
        }
    }, [classId])


    const handleCreate = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(classInfo.maLop && classInfo.moTa && classInfo.tenLop) {
            try {
                e.preventDefault()
                const token = document.cookie.split("=")[1]
    
                axios.post("v1/builder/form/lop-hoc/data", classInfo, {
                    headers: {
                        token: `Bearer ${token}`
                    }
                })
                navigate("/management/class")
            } catch (error) {
                console.log({ error });
            }
        }
    }

    const handleUpdate = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(classInfo.maLop && classInfo.moTa && classInfo.tenLop) {
            try {
                e.preventDefault()
                const token = document.cookie.split("=")[1]
    
                axios.put("v1/builder/form/lop-hoc/data", {...classInfo, id: Number(classId)}, {
                    headers: {
                        token: `Bearer ${token}`
                    }
                })
                navigate("/management/class")
            } catch (error) {
                console.log({ error });
            }
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
                        placeholder="name@flowbite.com"
                        required
                        value={classInfo.maLop}
                        onChange={(e) => setClassInfo({
                            ...classInfo,
                            maLop: e.target.value
                        })}
                    />
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
                onClick={() => navigate("/management/class")}
            >
                Huỷ
            </button>
        </div>

    )
}

export default FormClass