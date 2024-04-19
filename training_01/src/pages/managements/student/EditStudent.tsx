import FormStudennt from "../../../components/student/Form"
import AdminLayout from "../../../layouts/AdminLayout"
import { useLocation } from "react-router-dom"

const EditStudent = () => {
    const location = useLocation()
    const studentId = location.pathname.split("/")[location.pathname.split("/").length - 1]

    return (
        <AdminLayout>
            <div className="mt-5">
                <div className="py-4 my-6 text-2xl font-semibold">
                    <span className="opacity-40">Lớp học / </span>
                    <span>Chỉnh sửa sinh viên</span>
                </div>

                <div className="bg-white p-6">
                    <FormStudennt studentId={studentId} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default EditStudent
