import axios from "axios"
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IData {
    id: string
    ma: string,
    thamSo: string,
    moTa: string
}


const getCateById = async ({ cateId }: { cateId: string }) => {
    const token = document.cookie.split("=")[1]
    const res = await axios.get(`v1/builder/form/cau-hinh/data/${cateId}`, {
        headers: {
            token: `Bearer ${token}`
        }
    });

    if (!res.data) {
        throw new Error("Error when get cate by Id")
    }

    return res.data.data
}

const FormCategories = ({ cateId }: { cateId?: string }) => {
    const [isLoading, setIsLoading] = useState(cateId ? true : false)
    const navigate = useNavigate()
    const [categoryInfo, setCategoryInfo] = useState({
        ma: "",
        thamSo: "",
        moTa: ""
    })

    useEffect(() => {
        if (cateId) {
            const getData = async () => {
                const data: IData = await getCateById({ cateId })
                setCategoryInfo({
                    ma: data.ma,
                    moTa: data.moTa,
                    thamSo: data.thamSo
                })
                setIsLoading(false)
            }
            getData()
        }
    }, [cateId])


    const handleCreate = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(categoryInfo.ma && categoryInfo.moTa && categoryInfo.thamSo) {
            try {
                e.preventDefault()
                const token = document.cookie.split("=")[1]
    
                axios.post("v1/builder/form/cau-hinh/data", categoryInfo, {
                    headers: {
                        token: `Bearer ${token}`
                    }
                })
                navigate("/management/categories-config")
            } catch (error) {
                console.log({ error });
            }
        }
    }

    const handleUpdate = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(categoryInfo.ma && categoryInfo.moTa && categoryInfo.thamSo) {
            try {
                e.preventDefault()
                const token = document.cookie.split("=")[1]
                axios.put("v1/builder/form/cau-hinh/data", { ...categoryInfo, id: Number(cateId) }, {
                    headers: {
                        token: `Bearer ${token}`
                    }
                })
                navigate("/management/categories-config")
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
                    <label htmlFor="ma" className="block mb-2 text-sm font-medium text-gray-900 ">Mã</label>
                    <input
                        type="text"
                        id="ma"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Tên danh mục"
                        required
                        value={categoryInfo.ma}
                        onChange={(e) => setCategoryInfo({
                            ...categoryInfo,
                            ma: e.target.value
                        })}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="thamSo" className="block mb-2 text-sm font-medium text-gray-900">Tham Số</label>
                    <input
                        type="text"
                        id="thamSo"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        value={categoryInfo.thamSo}
                        onChange={(e) => setCategoryInfo({
                            ...categoryInfo,
                            thamSo: e.target.value
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
                    onChange={(e) => setCategoryInfo({
                        ...categoryInfo,
                        moTa: e.target.value
                    })}
                >{categoryInfo.moTa}</textarea>
            </div>
            <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={(e) => cateId ? handleUpdate(e) : handleCreate(e)}
            >
                {cateId ? "Cập nhập" : "Tạo mới"}
            </button>
            <button
                className="text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yebg-yellow-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ml-2"
                onClick={() => navigate("/management/categories-config")}
            >
                Huỷ
            </button>
        </div>

    )
}

export default FormCategories