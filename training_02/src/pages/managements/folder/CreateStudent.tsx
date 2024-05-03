import FormFolder from "../../../components/folder/Form"

const CreateFolder = () => {
    return (
        <div className="mt-5">
            <div className="py-4 my-6 text-2xl font-semibold">
                <span className="opacity-40">Folder / </span>
                <span>Tạo mới thư mục</span>
            </div>

            <div className="bg-white p-6">
                <FormFolder />
            </div>
        </div>
    )
}

export default CreateFolder
