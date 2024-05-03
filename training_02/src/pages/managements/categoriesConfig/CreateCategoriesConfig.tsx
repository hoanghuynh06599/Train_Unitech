import FormCategories from "../../../components/categoriesConfig/Form"
const CreateCategoriesConfig = () => {
    return (
        <div className="mt-5">
            <div className="py-4 my-6 text-2xl font-semibold">
                <span className="opacity-40">Danh mục cấu hình / </span>
                <span>Tạo mới danh mục cấu hình</span>
            </div>

            <div className="bg-white p-6">
                <FormCategories />
            </div>
        </div>
    )
}

export default CreateCategoriesConfig
