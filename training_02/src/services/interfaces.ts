export interface ISideBarItem {
    children: ISideBarItem[]
    name: string
    url: string
}

export interface ISubItemSideBarItem {
    children: ISubItemSideBarItem[]
    name: string
    url: string
    id: string
}

export interface IClassData {
    id: string
    maLop: string,
    tenLop: string,
    moTa: string
}

export interface IStudentData {
    id: string
    maSinhVien: string,
    tenSinhVien: string,
    moTa: string
}

export interface IFolderData {
    id: string
    name: string,
    parent: IFolderData,
    sort: number,
    description: string
}

export interface IFormData {
    id: string
    name: string,
    code: string,
    checkAccess: boolean,
    showView: boolean,
    description: string
    folder?: IFolderData
}

export interface IResStudentData {
    id: string
    maSinhVien: string,
    tenSinhVien: string,
    moTa: string
    lop: {
        id: number,
    }
}

export interface IPaging {
    page: number
    totalPage: number,
    allowNext: boolean,
    allowPrev: boolean,

}

export interface IError {
    response: {
        status: number
    }
}

export interface IFolderError {
    status: number
}

export interface ClassValue {
    id: number
    tenLop: string
}

export interface IMenuItem {
    id: number
    name: string
    pageTitle: string
    url: string
}

export interface IFormFieldDetailData {
    id: number
    name: string
    type: string
    apiKey: string
    defaultValue: unknown
    description: string
    displayOnList: boolean
    displayOnListDefault: boolean
    formCol: number
    formHidden: boolean
    isMultiple: boolean
    isParent: boolean
    isRequired: boolean
    isUnique: boolean
    max: number
    min: number
    referenceId: number
    relationship: string
    sort: number
    sqlWhere: string
}


export interface IFormFieldDataWithPosition extends IFormFieldDetailData{
    isChangePosition: boolean
}

export interface IDataType {
    id: number
    name: string
    dataType: string
    subName: string
    desc: string
}