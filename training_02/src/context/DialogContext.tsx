import { createContext, useState } from "react"
import { IFormFieldDetailData } from "../services/interfaces"

interface IDialogContext {
    isOpen: boolean
    type: string
    isUpdate: boolean
    formFieldItemId: number | undefined
    formFieldId: number,
    formFieldData: IFormFieldDetailData | undefined, 
    countRefresh: number
    formFieldType: string, 
    setFormFieldType: React.Dispatch<React.SetStateAction<string>>
    setCountRefresh: React.Dispatch<React.SetStateAction<number>>
    setFormFieldData: React.Dispatch<React.SetStateAction<IFormFieldDetailData | undefined>>
    setFormFieldId: React.Dispatch<React.SetStateAction<number>>
    handleCloseDialog: () => void
    handleOpenDialog: (
        { isUpdate, type, formField, callback }: { 
            isUpdate: boolean, 
            type: string, 
            formField?: number, 
            callback?: () => void 
        }) => void
}

const DialogContext = createContext<IDialogContext | undefined>(undefined);

const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [type, setType] = useState<string>('')
    const [formFieldId, setFormFieldId] = useState<number>(0)
    const [formFieldItemId, setFormFieldItemId] = useState<number | undefined>(undefined)
    const [formFieldData, setFormFieldData] = useState<IFormFieldDetailData>()
    const [countRefresh, setCountRefresh] = useState<number>(0)
    const [formFieldType, setFormFieldType] = useState<string>("")

    const handleCloseDialog = () => {
        setIsOpen(false)
        setIsUpdate(false)
        setType('')
    }

    const handleOpenDialog = async ({ isUpdate, type, formField, callback }: { 
        isUpdate: boolean, 
        type: string, 
        formField?: number,
        callback?: () => void,  
    }) => {
        if(callback) {
            await callback()
        }
        setFormFieldItemId(formField ?? undefined)
        setIsUpdate(isUpdate)
        setType(type)
        setIsOpen(true)
    }

    const values = {
        handleCloseDialog,
        handleOpenDialog,
        isOpen,
        isUpdate,
        type,
        formFieldItemId,
        formFieldId, 
        setFormFieldId,
        formFieldData, 
        setFormFieldData,
        countRefresh, 
        setCountRefresh,
        formFieldType, 
        setFormFieldType
    }

    return (
        <DialogContext.Provider value={values}>
            {children}
        </DialogContext.Provider>
    )
}

export { DialogProvider, DialogContext }
