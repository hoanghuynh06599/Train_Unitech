import { useEffect, useRef, useState } from "react";
import BoxField from "../../../components/formField/BoxField"
import DataType from "../../../components/formField/DataType"
import DraggableList from "react-draggable-list";
import { IError, IFormFieldDataWithPosition } from "../../../services/interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { requestWithToken } from "../../../hooks/useRequest";
import { useDialogContext } from "../../../hooks/useDialog";

const FormField = () => {
    const dialogContext = useDialogContext()
    const location = useLocation()
    const navigate = useNavigate()
    const containerRef = useRef<HTMLDivElement | null>(null);
    const formfieldId = location.pathname.split("/")[location.pathname.split("/").length - 1]
    const [list, setList] = useState<React.SetStateAction<IFormFieldDataWithPosition[]>>([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const handleGetAllFields = async () => {
            setIsLoading(true)
            try {
                const res = await requestWithToken({ method: "GET", url: `v1/builder/form/${formfieldId}/field`, typeAuthorized: "Token" })
                const tempData: IFormFieldDataWithPosition[] = [];
                res.data.forEach((item: IFormFieldDataWithPosition) => {
                    tempData.push({
                        ...item,
                        isChangePosition: false,
                    })
                })
                setList(tempData.sort((a, b) => a.sort - b.sort))
                dialogContext?.setFormFieldId(Number(formfieldId))
                setIsLoading(false)
            } catch (error) {
                if ((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
                setIsLoading(false)
            }
        }
        handleGetAllFields()
    }, [dialogContext?.countRefresh])


    const _onListChange = async (newList: IFormFieldDataWithPosition[]) => {
        const newListSorted = newList.map((item, index) => {
            if(item.sort !== index) {
                return {
                    ...item,
                    sort: index,
                    isChangePosition: true
                }
            } else {
                return {
                    ...item,
                    isChangePosition: false
                }
            }
        })

        const listChangePositionPromised: Promise<unknown>[] = [];
        newListSorted.forEach(item => {
            if(item.isChangePosition) {
                listChangePositionPromised.push(
                    requestWithToken({
                        method: "PUT", 
                        url:`v1/builder/form/${formfieldId}/field`, 
                        typeAuthorized: "Token",
                        body: item
                    })
                )
            }
        })

        setList(newListSorted);
        await Promise.all(listChangePositionPromised)
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-white">
                <h1 className="pt-4 px-8 pb-2 text-3xl font-semibold">Test</h1>
                <ul className="pl-6 border-b border-slate-300">
                    <li className="uppercase text-base tracking-widest max-w-fit text-blue-600 font-semibold py-2 px-3 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600">fields</li>
                </ul>
            </div>
            <div className="grid grid-cols-5 flex-grow h-full overflow-hidden">
                <div className="col-span-4 p-8 bg-white h-full overflow-y-auto hide_scrollbar" ref={containerRef}>
                    <div className="flex justify-center">
                        {
                            isLoading ? <p>Loading...</p> :
                                list.length === 0 ? <p>Bạn chưa tạo field nào</p> :
                                    <ul
                                        className="w-[720px] space-y-3"
                                    >
                                        <DraggableList
                                            itemKey="id"
                                            list={list}
                                            template={BoxField}
                                            onMoveEnd={(newList) => _onListChange(newList as IFormFieldDataWithPosition[])}
                                            container={() => containerRef.current}
                                        />
                                    </ul>
                        }
                    </div>
                </div>
                <div className="col-span-1 py-5 px-4 bg-slate-100 h-full overflow-y-auto hide_scrollbar">
                    <h1 className="font-semibold text-lg mb-4">Add Fields</h1>
                    {DataType()}
                </div>
            </div>
        </div>
    )
}

export default FormField
