import { FC } from "react"
import { IError, IFormFieldDetailData } from "../../services/interfaces"
import { useDialogContext } from "../../hooks/useDialog"
import { requestWithToken } from "../../hooks/useRequest"
import { useNavigate } from "react-router-dom"

interface ITemplateProps {
    item: IFormFieldDetailData
    dragHandleProps: {
        onMouseDown: () => void
        onTouchStart: () => void
    }
}

const draggButton = <svg viewBox="0 0.5 9 13" data-icon="hygraph-icon" aria-hidden="true" focusable="false" className="css-c4scp8"><g fillRule="evenodd" transform="translate(0 .5)"><circle cx="1.5" cy="1.5" r="1.5"></circle><circle cx="7.5" cy="1.5" r="1.5"></circle><circle cx="1.5" cy="6.5" r="1.5"></circle><circle cx="7.5" cy="6.5" r="1.5"></circle><circle cx="1.5" cy="11.5" r="1.5"></circle><circle cx="7.5" cy="11.5" r="1.5"></circle></g></svg>

const BoxField: FC<ITemplateProps> = ({ item, dragHandleProps }) => {
    const dialogContext = useDialogContext()
    const navigate = useNavigate()

    const handleGetFormFieldValue = async () => {
        try {
            const res = await requestWithToken({
                method: "GET", 
                url: `v1/builder/form/${dialogContext?.formFieldId}/field/${item.id}`,
                typeAuthorized: "Token"
            })
            dialogContext?.setFormFieldData(res.data)
        } catch (error) {
            if ((error as IError).response.status === 401) {
                navigate("/auth/login")
            }
        }
    }

    const handleOpenEditDialog = async () => {
        await handleGetFormFieldValue()
        dialogContext?.handleOpenDialog({
            isUpdate: true, 
            type: 'actions', 
            formField: item.id
        })
    }

    const handleOpenDeleteDialog = async () => {
        await handleGetFormFieldValue()
        dialogContext?.handleOpenDialog({
            isUpdate: false, 
            type: 'delete', 
            formField: item.id
        })
    }

    return (
        <li className="group bg-white cursor-default p-4 border border-slate-300 rounded-md mb-1.5 flex items-center gap-3 shadow-md shadow-slate-200 select-none" key={item.id}>
            <div
                className="h-3 w-3 cursor-grab"
                {...dragHandleProps}
            >
                {draggButton}
            </div>
            <div>
                <p className="mb-1">
                    <span className="font-medium inline-block mr-1">{item.name}</span>
                </p>
                <div className="flex items-center justify-start gap-1">
                    <p className="py-1 px-2 rounded-md bg-slate-200 max-w-fit text-xs font-semibold text-slate-700">
                        {item.type}
                    </p>
                    <p 
                        className="py-1 px-2 rounded-md bg-indigo-500 hover:bg-indigo-600 max-w-fit text-xs font-semibold text-white cursor-pointer opacity-0 group-hover:opacity-100"
                        onClick={handleOpenEditDialog}
                    >
                        Edit Field
                    </p>
                    <p 
                        className="py-1 px-2 rounded-md bg-red-500 hover:bg-red-600 max-w-fit text-xs font-semibold text-white cursor-pointer opacity-0 group-hover:opacity-100"
                        onClick={handleOpenDeleteDialog}
                    >
                        Delete Field
                    </p>
                </div>
            </div>
        </li>
    )
}

export default BoxField
