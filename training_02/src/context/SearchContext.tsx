import { Dispatch, createContext, useState } from "react"

interface ISearchContext {
    cateConfigSearch: string;
    setCateConfigSearch: Dispatch<React.SetStateAction<string>>;
    studentSearch: string;
    setStudentSearch: Dispatch<React.SetStateAction<string>>;
    classSearch: string; 
    setClassSearch: Dispatch<React.SetStateAction<string>>;
    folderSearch: string; 
    setFolderSearch: Dispatch<React.SetStateAction<string>>;
    formSearch: string;
    setFormSearch: Dispatch<React.SetStateAction<string>>;
    folderSearchByParent: string;
    setFolderSearchByParent: Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<ISearchContext | undefined>(undefined);


const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [cateConfigSearch, setCateConfigSearch] = useState("")
    const [classSearch, setClassSearch] = useState("")
    const [studentSearch, setStudentSearch] = useState("")
    const [folderSearch, setFolderSearch] = useState("")
    const [folderSearchByParent, setFolderSearchByParent] = useState("")
    const [formSearch, setFormSearch] = useState("")

    const values = {
        cateConfigSearch, setCateConfigSearch,
        studentSearch, setStudentSearch,
        classSearch, setClassSearch,
        folderSearch, setFolderSearch,
        formSearch, setFormSearch,
        folderSearchByParent, 
        setFolderSearchByParent
    }

    return (
        <SearchContext.Provider value={values}>
            {children}
        </SearchContext.Provider>
    )
}

export { SearchProvider, SearchContext }
