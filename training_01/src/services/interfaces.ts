
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
