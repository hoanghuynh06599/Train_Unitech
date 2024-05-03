import { useLocation } from "react-router-dom"
import FormForm from "../../../components/form/Form"

const EditForm = () => {
    const location = useLocation()
    const formId = location.pathname.split("/")[location.pathname.split("/").length - 1]

    return (
        <div className="mt-5">
            <div className="py-4 my-6 text-2xl font-semibold">
                <span className="opacity-40">Form / </span>
                <span>Chỉnh sửa form</span>
            </div>

            <div className="bg-white p-6">
                <FormForm formId={formId} />
            </div>
        </div>
    )
}

export default EditForm
