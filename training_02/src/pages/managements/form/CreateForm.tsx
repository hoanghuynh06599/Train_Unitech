import FormForm from "../../../components/form/Form"

const CreateForm = () => {
    return (
        <div className="mt-5">
            <div className="py-4 my-6 text-2xl font-semibold">
                <span className="opacity-40">Form / </span>
                <span>Tạo mới form</span>
            </div>

            <div className="bg-white p-6">
                <FormForm />
            </div>
        </div>
    )
}

export default CreateForm
