import FormCategories from "../../../components/categoriesConfig/Form"
import AdminLayout from "../../../layouts/AdminLayout"
import { useLocation } from "react-router-dom"

const EditCategoriesConfig = () => {
    const location = useLocation()
    const cateId = location.pathname.split("/")[location.pathname.split("/").length - 1]

    return (
        <AdminLayout>
            <div className="mt-5">
                <div className="py-4 my-6 text-2xl font-semibold">
                    <span className="opacity-40">Danh mục cấu hình / </span>
                    <span>Chỉnh sửa danh mục cấu hình</span>
                </div>

                <div className="bg-white p-6">
                    <FormCategories cateId={cateId} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default EditCategoriesConfig
