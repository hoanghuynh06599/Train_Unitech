import FormClass from "../../../components/class/Form"
import AdminLayout from "../../../layouts/AdminLayout"
import { useLocation } from "react-router-dom"

const EditClass = () => {
    const location = useLocation()
    const classId = location.pathname.split("/")[location.pathname.split("/").length - 1]

    return (
        <AdminLayout>
            <div className="mt-5">
                <div className="py-4 my-6 text-2xl font-semibold">
                    <span className="opacity-40">Lớp học / </span>
                    <span>Chỉnh sửa lớp học</span>
                </div>

                <div className="bg-white p-6">
                    <FormClass classId={classId} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default EditClass
