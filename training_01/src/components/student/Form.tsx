import axios from "axios"
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IData {
    id: string
    maSinhVien: string,
    tenSinhVien: string,
    moTa: string
    lop: {
        id: number,
    }
}

interface ClassValue {
    id: number
    tenLop: string
}

const getStudentById = async ({ studentId }: { studentId: string }) => {
    const token = localStorage.getItem('token')
    const res = await axios.get(`v1/builder/form/sinh-vien/data/${studentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.data) {
        throw new Error("Error when get student by Id")
    }

    return res.data.data
}

const FormStudent = ({ studentId }: { studentId?: string }) => {
    const [isLoading, setIsLoading] = useState(studentId ? true : false)
    const navigate = useNavigate()
    const [studentClass, setStudentClass] = useState([])
    const [studentInfo, setStudentInfo] = useState({
        maSinhVien: "",
        tenSinhVien: "",
        // moTa: "",
        classId: 0
    })
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const getClassData = async() => {
            const token = localStorage.getItem('token')
            const dataClass = await axios.get(`v1/builder/form/lop-hoc/data`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const listClass = dataClass.data.data?.map((classValue: ClassValue) => {
                return {
                    id: classValue.id,
                    tenLop: classValue.tenLop
                }
            })
            setStudentClass(listClass)
        }
        getClassData()
        if (studentId) {
            const getData = async () => {
                const data: IData = await getStudentById({ studentId })
                setStudentInfo({
                    maSinhVien: data?.maSinhVien,
                    // moTa: data?.moTa,
                    tenSinhVien: data?.tenSinhVien,
                    classId: data.lop.id
                })
                setIsLoading(false)
            }
            getData()
        }
    }, [studentId])

    
    const handleCreate = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(studentInfo.classId && studentInfo.maSinhVien && studentInfo.tenSinhVien) {
            try {
                e.preventDefault()
                const token = localStorage.getItem('token')
    
                axios.post("v1/builder/form/sinh-vien/data", {
                    maSinhVien: studentInfo.maSinhVien,
                    tenSinhVien: studentInfo.tenSinhVien,
                    lop: {
                        id: studentInfo.classId
                    },
                    // moTa: studentInfo.moTa
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                navigate("/administrator/builder/data/sinh-vien.html")
            } catch (error) {
                console.log({ error });
            }
        } else {
            setIsError(true)
        }
    }

    const handleUpdate = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(studentInfo.classId && studentInfo.maSinhVien && studentInfo.tenSinhVien) {
            try {
                e.preventDefault()
                const token = localStorage.getItem('token')
    
                axios.put("v1/builder/form/sinh-vien/data", {
                    id: Number(studentId),
                    maSinhVien: studentInfo.maSinhVien,
                    tenSinhVien: studentInfo.tenSinhVien,
                    lop: {
                        id: studentInfo.classId
                    },
                    // moTa: studentInfo.moTa
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                navigate("/administrator/builder/data/sinh-vien.html")
            } catch (error) {
                console.log({ error });
            }
        } else {
            setIsError(true)
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
                        placeholder="name@flowbite.com"
                        required
                        value={studentInfo.maSinhVien}
                        onChange={(e) => setStudentInfo({
                            ...studentInfo,
                            maSinhVien: e.target.value
                        })}
                    />
                    {isError && !studentInfo.maSinhVien ? <p className="text-sm text-red-500">Mã sinh viên đang trống</p> : ""}
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
                    {isError && !studentInfo.tenSinhVien ? <p className="text-sm text-red-500">Tên sinh viên đang trống</p> : ""}
                </div>
            </div>
            {/* <div className="mb-5">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Mô tả</label>
                <textarea
                    id="message"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave a comment..."
                    onChange={(e) => setStudentInfo({
                        ...studentInfo,
                        moTa: e.target.value
                    })}
                >{studentInfo.moTa}</textarea>
                {isError && !studentInfo.moTa ? <p className="text-sm text-red-500">Mô tả sinh viên đang trống</p> : ""}
            </div> */}

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
                        studentClass?.map((item: ClassValue) =>(
                            <option 
                                value={item.id} 
                                key={item.id}
                                selected={item.id === studentInfo.classId}
                            >{item.tenLop}</option>
                        ))
                    }
                </select>
                {isError && !studentInfo.classId ? <p className="text-sm text-red-500">Lớp đang trống</p> : ""}
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
