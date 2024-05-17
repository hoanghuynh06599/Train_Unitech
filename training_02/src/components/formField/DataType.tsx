import { useDialogContext } from "../../hooks/useDialog"
import { listDataType } from "../../services/data/DataType"
import { IDataType } from "../../services/interfaces"

const DataType = () => {
    const dialogContext = useDialogContext()

    const handleChooseDataType = ({type}: {type: string}) => {
        if(dialogContext) {
            dialogContext.setFormFieldData(undefined)
            dialogContext.setFormFieldType(type)
        }
    }

    return (
        <ul className="space-y-2">
            {
                listDataType.map((dataType: IDataType) => (
                    <li key={dataType.id}>
                        <p className="uppercase text-xs font-bold text-gray-500 tracking-wider mb-1">{dataType.name}</p>
                        <div
                            className="bg-white px-4 py-2.5 border border-slate-300 shadow-sm rounded-md cursor-pointer mb-1.5"
                            onClick={() => dialogContext?.handleOpenDialog({
                                isUpdate: false,
                                type: 'actions',
                                formField: dialogContext.formFieldId,
                                callback: () => handleChooseDataType({type: dataType.dataType })
                            })}
                        >
                            <p className="text-sm font-medium mb-0.5">{dataType.subName}</p>
                            <p className="text-xs text-gray-500">{dataType.desc}</p>
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}

export default DataType
