import FormClass from "../../../components/class/Form"

const CreateClass = () => {
    return (
        <div className="mt-5">
            <div className="py-4 my-6 text-2xl font-semibold">
                <span className="opacity-40">Lớp học / </span>
                <span>Tạo mới lớp học</span>
            </div>

            <div className="bg-white p-6">
                <FormClass />
            </div>
        </div>
    )
}

export default CreateClass
