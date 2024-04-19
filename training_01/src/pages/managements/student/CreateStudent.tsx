import FormStudent from "../../../components/student/Form"
import AdminLayout from "../../../layouts/AdminLayout"

const CreateStudent = () => {
    return (
        <AdminLayout>
            <div className="mt-5">
                <div className="py-4 my-6 text-2xl font-semibold">
                    <span className="opacity-40">Sinh viên / </span>
                    <span>Tạo mới sinh viên</span>
                </div>

                <div className="bg-white p-6">
                    <FormStudent />
                </div>
            </div>
        </AdminLayout>
    )
}

export default CreateStudent
