import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../../hooks/useSearchContext";
import { requestWithToken } from "../../hooks/useRequest";
import { ClassValue, IError, IResStudentData } from "../../services/interfaces";
import { getClass } from "../class/ListClass";


const getStudentById = async ({ studentId }: { studentId: string }) => {
    const res = await requestWithToken({
        url: `v1/builder/form/sinh-vien/data/${studentId}`,
        method: "GET",
        typeAuthorized: "Authorization",
    })

    return res.data
}

const FormStudent = ({ studentId }: { studentId?: string }) => {
    const [isLoading, setIsLoading] = useState(studentId ? true : false)
    const searchContext = useSearchContext()
    const navigate = useNavigate()
    const [studentClass, setStudentClass] = useState([])
    const [studentInfo, setStudentInfo] = useState({
        maSinhVien: "",
        tenSinhVien: "",
        classId: 0
    })
    const [isError, setIsError] = useState({
        state: false,
        messages: {
            maSinhVien: "",
            tenSinhVien: "",
            classId: ""
        }
    })

    useEffect(() => {
        searchContext?.setStudentSearch("")
    }, [])


    useEffect(() => {
        const getClassData = async () => {
            try {
                const dataClass = await getClass({ page: 1 })

                const listClass = dataClass.data.map((classValue: ClassValue) => {
                    return {
                        id: classValue.id,
                        tenLop: classValue.tenLop
                    }
                })
                setStudentClass(listClass)
            } catch (error) {
                if ((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
            }
        }

        getClassData()
        if (studentId) {
            const getData = async () => {
                const data: IResStudentData = await getStudentById({ studentId })
                setStudentInfo({
                    maSinhVien: data?.maSinhVien,
                    tenSinhVien: data?.tenSinhVien,
                    classId: data.lop.id
                })
                setIsLoading(false)
            }
            getData()
        }
    }, [studentId])


    const handleCreate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (studentInfo.classId && studentInfo.maSinhVien && studentInfo.tenSinhVien) {
            try {
                e.preventDefault()
                await requestWithToken({
                    url: "v1/builder/form/sinh-vien/data",
                    method: "POST",
                    typeAuthorized: "Authorization",
                    body: {
                        maSinhVien: studentInfo.maSinhVien,
                        tenSinhVien: studentInfo.tenSinhVien,
                        lop: {
                            id: studentInfo.classId
                        },
                    }
                })
                navigate("/administrator/builder/data/sinh-vien.html")
            } catch (error) {
                if ((error as IError).response.status === 400) {
                    setIsError({
                        state: true,
                        messages: {
                            classId: "",
                            tenSinhVien: "",
                            maSinhVien: "Mã sinh viên bị trùng"
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
                    classId: studentInfo.classId === 0 ? "Lớp đang bị trống" : "",
                    tenSinhVien: !studentInfo.tenSinhVien ? "Tên sinh viên đang bị trống" : "",
                    maSinhVien: !studentInfo.maSinhVien ? "Mã sinh viên đang bị trống" : ""
                }
            })
        }
    }

    const handleUpdate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (studentInfo.classId && studentInfo.maSinhVien && studentInfo.tenSinhVien) {
            try {
                e.preventDefault()
                await requestWithToken({
                    url: "v1/builder/form/sinh-vien/data",
                    method: "PUT",
                    typeAuthorized: "Authorization",
                    body: {
                        id: Number(studentId),
                        maSinhVien: studentInfo.maSinhVien,
                        tenSinhVien: studentInfo.tenSinhVien,
                        lop: {
                            id: studentInfo.classId
                        },
                    }
                })
                navigate("/administrator/builder/data/sinh-vien.html")
            } catch (error: unknown) {
                if ((error as IError).response.status === 400) {
                    setIsError({
                        state: true,
                        messages: {
                            classId: "",
                            tenSinhVien: "",
                            maSinhVien: "Mã sinh viên bị trùng"
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
                    classId: studentInfo.classId === 0 ? "Lớp đang bị trống" : "",
                    tenSinhVien: !studentInfo.tenSinhVien ? "Tên sinh viên đang bị trống" : "",
                    maSinhVien: !studentInfo.maSinhVien ? "Mã sinh viên đang bị trống" : ""
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
                    <label htmlFor="maSinhVien" className="block mb-2 text-sm font-medium text-gray-900 ">Mã sinh viên</label>
                    <input
                        type="text"
                        id="maSinhVien"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Tên sinh viên"
                        required
                        value={studentInfo.maSinhVien}
                        onChange={(e) => setStudentInfo({
                            ...studentInfo,
                            maSinhVien: e.target.value
                        })}
                    />
                    {isError.state && isError.messages.maSinhVien ? <p className="text-sm text-red-500">{isError.messages.maSinhVien}</p> : ""}
                </div>
                <div className="w-full">
                    <label htmlFor="tenSinhVien" className="block mb-2 text-sm font-medium text-gray-900">Tên sinh viên</label>
                    <input
                        type="text"
                        id="tenSinhVien"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        value={studentInfo.tenSinhVien}
                        onChange={(e) => setStudentInfo({
                            ...studentInfo,
                            tenSinhVien: e.target.value
                        })}
                    />
                    {isError.messages && isError.messages.tenSinhVien ? <p className="text-sm text-red-500">{isError.messages.tenSinhVien}</p> : ""}
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Lớp</label>
                <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={e => setStudentInfo({
                        ...studentInfo,
                        classId: Number(e.target.value)
                    })}
                >
                    <option >Chọn lớp</option>
                    {
                        studentClass?.map((item: ClassValue) => (
                            <option
                                value={item.id}
                                key={item.id}
                                selected={item.id === studentInfo.classId}
                            >{item.tenLop}</option>
                        ))
                    }
                </select>
                {isError.state && isError.messages.classId ? <p className="text-sm text-red-500">{isError.messages.classId}</p> : ""}
            </div>
            <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={(e) => studentId ? handleUpdate(e) : handleCreate(e)}
            >
                {studentId ? "Cập nhập" : "Tạo mới"}
            </button>
            <button
                className="text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yebg-yellow-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ml-2"
                onClick={() => navigate("/administrator/builder/data/sinh-vien.html")}
            >
                Huỷ
            </button>
        </div>

    )
}

export default FormStudent
