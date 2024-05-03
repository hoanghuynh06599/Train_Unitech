import FormFolder from "../../../components/folder/Form"
import { useLocation } from "react-router-dom"

const EditFolder = () => {
    const location = useLocation()
    const folderId = location.pathname.split("/")[location.pathname.split("/").length - 1]

    return (
        <div className="mt-5">
            <div className="py-4 my-6 text-2xl font-semibold">
                <span className="opacity-40">Folder / </span>
                <span>Chỉnh sửa thư mục</span>
            </div>

            <div className="bg-white p-6">
                <FormFolder folderId={folderId} />
            </div>
        </div>
    )
}

export default EditFolder
