export interface ISideBarItem {
    children: ISideBarItem[]
    name: string
    url: string
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
