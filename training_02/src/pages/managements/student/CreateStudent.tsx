import FormStudent from "../../../components/student/Form"

const CreateStudent = () => {
    return (
        <div className="mt-5">
            <div className="py-4 my-6 text-2xl font-semibold">
                <span className="opacity-40">Sinh viên / </span>
                <span>Tạo mới sinh viên</span>
            </div>

            <div className="bg-white p-6">
                <FormStudent />
            </div>
        </div>
    )
}

export default CreateStudent
