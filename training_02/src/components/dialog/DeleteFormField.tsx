import { useNavigate } from "react-router-dom";
import { useDialogContext } from "../../hooks/useDialog"
import { requestWithToken } from "../../hooks/useRequest";
import { IError } from "../../services/interfaces";

const DeleteFormField = () => {
    const dialogContext = useDialogContext()
    const navigate = useNavigate()

    const handleDeleteFormField = async () => {
        try {
            await requestWithToken({
                method: "DELETE",
                url: `v1/builder/form/${dialogContext?.formFieldId}/field`,
                typeAuthorized: "Token",
                body: [dialogContext?.formFieldItemId]
            })
            dialogContext?.setCountRefresh((prev) => prev + 1)
            dialogContext?.handleCloseDialog()
        } catch (error) {
            console.log({error})
            if ((error as IError).response.status === 401) {
                navigate("/auth/login")
            }
        }
    }

    return (
        <div
            className={`w-screen h-screen bg-black/20 fixed top-0 left-0 z-50 items-center justify-center ${(dialogContext?.isOpen && dialogContext.type === 'delete') ? 'flex' : 'hidden'}`}
            onClick={dialogContext?.handleCloseDialog}
        >
            <div className="bg-white w-[792px]" onClick={(e) => e.stopPropagation()}>
                <div className="py-5 px-6 flex items-end justify-between border-b border-slate-200">
                    <span className="text-xl font-semibold">Delete Field</span>
                </div>
                <ul className="px-6 pt-7 pb-10 w-[564px] space-y-6">
                    <li>Are you sure you want to delete the field <strong>{dialogContext?.formFieldData?.name}</strong>?</li>
                    <li className="py-4 px-3 bg-orange-50">
                        <p className="text-yellow-600 font-semibold text-sm">Data stored in this field will be lost.</p>
                    </li>
                </ul>
                <div className="py-4 px-6 flex items-center justify-end gap-4">
                    <button
                        className="text-sm text-slate-600 font-semibold h-10 py-px px-5 hover:bg-slate-200 rounded-md"
                        onClick={dialogContext?.handleCloseDialog}
                    >
                        Cancel
                    </button>
                    <button 
                        className="text-sm text-slate-50 font-semibold h-10 py-px px-5 bg-red-500 hover:bg-red-600 rounded-md"
                        onClick={handleDeleteFormField}
                    >
                        Delete {dialogContext?.formFieldData?.name}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteFormField
