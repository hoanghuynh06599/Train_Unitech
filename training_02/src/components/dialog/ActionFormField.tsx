import { useState } from "react"
import { useDialogContext } from "../../hooks/useDialog"
import { camelize } from "../../utils/commonUtils"
// import { requestWithToken } from "../../hooks/useRequest"
import { IError, IFormFieldDetailData } from "../../services/interfaces"
import { useNavigate } from "react-router-dom"
import { requestWithToken } from "../../hooks/useRequest"
import { listDataType } from "../../services/data/DataType"

const tabs = [
    {
        id: 0,
        name: "Settings",
    },
    {
        id: 1,
        name: "Validations",
    },
    {
        id: 2,
        name: "Advanced",
    },
]

const SettingsTab = ({formFieldData, setFormFieldData}: {formFieldData: IFormFieldDetailData, setFormFieldData: React.Dispatch<React.SetStateAction<IFormFieldDetailData | undefined>> }) => {
    const [listOptions, setListOptions] = useState([
        {
            id: 0,
            name: "Is Multiple",
            apiName: "isMultiple",
            checked: formFieldData?.isMultiple,
        },
        {
            id: 1,
            name: "Display On List",
            apiName: "displayOnList",
            checked: formFieldData?.displayOnList,
        },
        {
            id: 2,
            name: "Display On List Default",
            apiName: "displayOnListDefault",
            checked: formFieldData?.displayOnListDefault,
        },
        {
            id: 3,
            name: "Form Hidden",
            apiName: "formHidden",
            checked: formFieldData?.formHidden,
        },
        {
            id: 4,
            name: "Is Parent",
            apiName: "isParent",
            checked: formFieldData?.isParent,
        },
    ])

    const handleChangeName = ({ value }: { value: string }) => {
        const apiIdFormat = camelize({ str: value });
        setFormFieldData({
            ...formFieldData,
            apiKey: apiIdFormat,
            name: value
        })
    }

    const handleChangeFieldOptions = ({ id, index }: { id: number, index: number }) => {
        setListOptions(listOptions.map(option => {
            if (option.id === id) {
                return {
                    ...option,
                    checked: !option.checked
                }
            }
            return option
        }))
        setFormFieldData({
            ...formFieldData,
            [listOptions[index].apiName] : !formFieldData[listOptions[index].apiName]
        })
    }

    return (
        <>
            <ul className="w-[564px] space-y-6 py-6">
                <li>
                    <label
                        htmlFor="display_name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Display Name
                    </label>
                    <input
                        type="text"
                        id="display_name"
                        className="border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2.5 py-1.5 focus:outline-none"
                        placeholder="John"
                        required
                        value={formFieldData?.name ?? ""}
                        onChange={(e) => handleChangeName({ value: e.target.value })}
                    />
                </li>
                <li>
                    <label
                        htmlFor="app_id"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        API ID
                    </label>
                    <input
                        type="text"
                        id="app_id"
                        className="border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2.5 py-1.5 focus:outline-none"
                        placeholder="John"
                        required
                        value={formFieldData?.apiKey ?? ""}
                        onChange={(e) => setFormFieldData({ ...formFieldData, apiKey: e.target.value })}
                    />
                </li>
                <li>
                    <label
                        htmlFor="decription"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Description
                    </label>
                    <textarea
                        id="decription"
                        onChange={(e) => setFormFieldData({
                            ...formFieldData, 
                            description: e.target.value
                        })}
                        value={formFieldData?.description}
                        rows={4}
                        className="block p-2.5 w-full border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 px-2.5 py-1.5 focus:outline-none"
                        placeholder="Write your thoughts here..."></textarea>
                </li>
            </ul>
            <p className="block mb-4 text-sm font-medium text-gray-900">Field options</p>
            <ul className="w-[564px] space-y-6 pb-6">
                {
                    listOptions.map((option, index) => (
                        <li className="flex items-center mb-4" key={option.id}>
                            <input
                                type="checkbox"
                                value=""
                                checked={option.checked}
                                onChange={() => handleChangeFieldOptions({ id: option.id, index })}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <p className="ms-2 text-xs font-medium text-gray-600">{option.name}</p>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

const ValidationsTab = ({formFieldData, setFormFieldData}: {formFieldData: IFormFieldDetailData, setFormFieldData: React.Dispatch<React.SetStateAction<IFormFieldDetailData | undefined>> }) => {
    const [minMaxState, setMinMaxState] = useState({
        checked: (formFieldData?.min || formFieldData?.max) ? true : false,
        type: (formFieldData?.min || formFieldData?.max) ? ((formFieldData?.min && formFieldData?.max) ? "between" : formFieldData?.max ? "not more than" : "at least") : "between",
        min: formFieldData?.min,
        max: formFieldData?.max
    })
    
    const [listValidations, setListValidations] = useState([
        {
            id: 0,
            name: "Is Required",
            apiName: "isRequired",
            checked: formFieldData?.isRequired,
        },
        {
            id: 1,
            name: "Is Unique",
            apiName: "isUnique",
            checked: formFieldData?.isUnique,
        },
    ])

    const handleChangeSelectValidation = ({ id, index }: { id: number, index: number }) => {
        setListValidations(listValidations.map(validation => {
            if (validation.id === id) {
                return {
                    ...validation,
                    checked: !validation.checked
                }
            } else {
                return validation
            }
        }))
        setFormFieldData({
            ...formFieldData,
            [listValidations[index].apiName]: !listValidations[index].apiName
        })
    }

    const handleSetMinMax = ({type, value}: {type: string, value: number}) => {
        setFormFieldData({
            ...formFieldData,
            [type]: value
        })
        setMinMaxState({
            ...minMaxState,
            [type]: value
        })
    }

    return (
        <ul className="w-[564px] space-y-6 py-6">
            {
                listValidations.map((option, index) => (
                    <li className="flex items-center mb-4" key={option.id}>
                        <input
                            type="checkbox"
                            value=""
                            checked={option.checked}
                            onChange={() => handleChangeSelectValidation({ id: option.id, index })}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <p className="ms-2 text-xs font-medium text-gray-600">{option.name}</p>
                    </li>
                ))
            }
            <li className="flex items-center flex-wrap mb-4">
                <input
                    onChange={() => setMinMaxState({
                        checked: !minMaxState.checked,
                        max: 0,
                        min: 0,
                        type: minMaxState.type
                    })}
                    type="checkbox"
                    checked={minMaxState.checked}
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <p className="ms-2 text-xs font-medium text-gray-600">Limit</p>
                <div className={`basis-full mt-4 ml-7 ${minMaxState.checked ? 'block' : 'hidden'}`}>
                    <div className="flex items-center">
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 flex-1  mr-4"
                            onChange={(e) => setMinMaxState({
                                ...minMaxState,
                                type: e.target.value,
                                max: e.target.value === 'at least' ? 0 : minMaxState.max,
                                min: e.target.value === 'not more than' ? 0 : minMaxState.min,
                            })}
                        >
                            <option value="at least">At least</option>
                            <option value="between" selected>Between</option>
                            <option value="not more than">Not more than</option>
                        </select>
                        <input
                            type="number"
                            className={`border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block px-2.5 py-1.5 focus:outline-none w-[100px] ${minMaxState.type === 'not more than' ? 'hidden' : 'block'}`}
                            placeholder="Min"
                            value={minMaxState.min}
                            onChange={(e) => handleSetMinMax({type: 'min', value: e.target.valueAsNumber})}
                        />
                        <span className={`text-xs mx-2 font-medium ${minMaxState.type === 'between' ? 'block' : 'hidden'}`}>&</span>
                        <input
                            type="number"
                            className={`border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block px-2.5 py-1.5 focus:outline-none w-[100px] ${minMaxState.type === 'at least' ? 'hidden' : 'block'}`}
                            placeholder="Max"
                            value={minMaxState.max}
                            defaultValue={""}
                            required
                            onChange={(e) => handleSetMinMax({type: 'max', value: e.target.valueAsNumber})}
                        />
                    </div>
                </div>
            </li>
        </ul>
    )
}

const AdvancedTab = ({formFieldData, setFormFieldData}: {formFieldData: IFormFieldDetailData, setFormFieldData: React.Dispatch<React.SetStateAction<IFormFieldDetailData | undefined>> }) => {
    const [advanced, setAdvanced] = useState<{
        hasDefaultValue: boolean,
        defaultValue: unknown,
        sqlWhere: string | null,
        relationship: string | null,
        referenceId: number | null,
    }>({
        hasDefaultValue: formFieldData?.defaultValue ? true : false,
        defaultValue: formFieldData?.defaultValue,
        sqlWhere: formFieldData?.sqlWhere,
        relationship: formFieldData?.relationship,
        referenceId: formFieldData?.referenceId,
    })

    return (
        <div className="w-[564px] space-y-6 py-6">
            <div>
                <p className="block mb-2 text-sm font-medium text-gray-900">Initialization</p>
                <ul className="w-[564px] space-y-6 ">
                    <li className="flex items-center flex-wrap ">
                        <input
                            onChange={() => setAdvanced({
                                ...advanced,
                                hasDefaultValue: !advanced.hasDefaultValue,
                                defaultValue: null
                            })}
                            type="checkbox"
                            checked={advanced.hasDefaultValue}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <p className="ms-2 text-xs font-medium text-gray-600">Default value</p>
                        <div className={`basis-full mt-4 ml-6 ${advanced.hasDefaultValue ? 'block' : 'hidden'}`}>
                            <div className="bg-blue-50 rounded-md py-4 px-3">
                                <label
                                    htmlFor="display_name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Default value
                                </label>
                                <input
                                    type="text"
                                    id="display_name"
                                    className="border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2.5 py-1.5 focus:outline-none"
                                    placeholder="John"
                                    value={formFieldData?.defaultValue as string}
                                    required
                                    onChange={(e) => setFormFieldData({
                                        ...formFieldData,
                                        defaultValue: e.target.value
                                    })}
                                />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div>
                <p className="block mb-2 text-sm font-medium text-gray-900">Field relationship</p>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 flex-1 mr-4"
                    onChange={(e) => setFormFieldData({
                        ...formFieldData,
                        relationship: e.target.value
                    })}
                    value={formFieldData?.relationship}
                >
                    <option value="1-n" selected>One to Many</option>
                    <option value="1-1">One to One</option>
                    <option value="n-n">Many to Many</option>
                </select>
            </div>
            <div>
                <label
                    htmlFor="display_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    SQL Where
                </label>
                <input
                    type="text"
                    id="display_name"
                    className="border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2.5 py-1.5 focus:outline-none"
                    placeholder="John"
                    required
                    value={formFieldData?.sqlWhere}
                    onChange={(e) => setFormFieldData({
                        ...formFieldData,
                        sqlWhere: e.target.value
                    })}
                />
            </div>
            <div>
                <label
                    htmlFor="display_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    ReferenceId
                </label>
                <input
                    type="text"
                    id="display_name"
                    className="border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2.5 py-1.5 focus:outline-none"
                    placeholder="John"
                    required
                    value={formFieldData?.referenceId}
                    onChange={(e) => setFormFieldData({
                        ...formFieldData,
                        referenceId : Number(e.target.value)
                    })}
                />
            </div>
        </div>
    )
}

const ActionFormField = () => {
    const navigate = useNavigate()
    const dialogContext = useDialogContext()
    const [activeTab, setActiveTab] = useState(0)
    const [formFieldData, setFormFieldData] = useState(dialogContext?.formFieldData)

    const handleUpdateFormField = async () => {
        try {
            await requestWithToken({
                method: "PUT",
                url: `v1/builder/form/${dialogContext?.formFieldId}/field`,
                typeAuthorized: "Token",
                body: formFieldData
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

    const handleCreateFormField = async () => {
        try {
            await requestWithToken({
                method: "POST",
                url: `v1/builder/form/${dialogContext?.formFieldId}/field`,
                typeAuthorized: "Token",
                body: {...formFieldData, type: dialogContext?.formFieldType}
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
            className={`bg-black/20 fixed inset-0 z-50 items-center justify-center overflow-auto p-10 ${(dialogContext?.isOpen && dialogContext.type === 'actions') ? 'flex' : 'hidden'}`}
            onClick={dialogContext?.handleCloseDialog}
        >
            <div className="bg-white max-w-[792px] relative w-full min-h[500px] min-w-0 m-auto" onClick={(e) => e.stopPropagation()}>
                <div className="py-5 px-6 flex items-end justify-between border-b border-slate-200">
                    <span className="text-xl font-semibold">
                        {
                            dialogContext?.isUpdate ? formFieldData?.name : listDataType.find(elem => elem.dataType == dialogContext?.formFieldType)?.name
                        }
                    </span>
                    {
                        dialogContext?.isUpdate ?
                            <span className="text-xl text-gray-400">{
                                listDataType.find(elem => elem.dataType == formFieldData?.type)?.desc
                            }</span> :
                            <span className="text-xl text-gray-400">{
                                listDataType.find(elem => elem.dataType == dialogContext?.formFieldType)?.desc
                            }</span>
                    }
                </div>
                <div className="px-6 pt-7 ">
                    <ul className="flex items-center justify-start gap-2">
                        {
                            tabs.map(tab => (
                                <li
                                    key={tab.id}
                                    className={`py-2.5 px-3 rounded-md cursor-pointer tracking-wider text-xs font-semibold uppercase ${activeTab === tab.id ? 'text-indigo-500 bg-indigo-100 ' : 'text-slate-800 hover:bg-slate-100'}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.name}
                                </li>
                            ))
                        }
                    </ul>
                    {
                        activeTab === 0 ? <SettingsTab formFieldData={formFieldData!} setFormFieldData={setFormFieldData} /> : 
                        activeTab === 1 ? <ValidationsTab formFieldData={formFieldData!} setFormFieldData={setFormFieldData} /> : 
                        activeTab === 2 ? <AdvancedTab formFieldData={formFieldData!} setFormFieldData={setFormFieldData} /> : null
                    }
                </div>
                <div className="py-4 px-6 flex items-center justify-end gap-4">
                    <button
                        className="text-sm text-slate-600 font-semibold h-10 py-px px-5 hover:bg-slate-200 rounded-md"
                        onClick={dialogContext?.handleCloseDialog}
                    >
                        Cancel
                    </button>
                    {
                        dialogContext?.isUpdate ?
                            <button 
                                className="text-sm text-slate-50 font-semibold h-10 py-px px-5 bg-indigo-500 hover:bg-indigo-600 rounded-md"
                                onClick={handleUpdateFormField}
                            >
                                Update
                            </button> :
                            <button 
                                className="text-sm text-slate-50 font-semibold h-10 py-px px-5 bg-indigo-500 hover:bg-indigo-600 rounded-md"
                                onClick={handleCreateFormField}
                            >
                                Create
                            </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default ActionFormField
