import { Dispatch, createContext, useState } from "react"

interface ISearchContext {
    cateConfigSearch: string;
    setCateConfigSearch: Dispatch<React.SetStateAction<string>>;
    studentSearch: string;
    setStudentSearch: Dispatch<React.SetStateAction<string>>;
    classSearch: string; setClassSearch: Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<ISearchContext | undefined>(undefined);


const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [cateConfigSearch, setCateConfigSearch] = useState("")
    const [classSearch, setClassSearch] = useState("")
    const [studentSearch, setStudentSearch] = useState("")

    const values = {
        cateConfigSearch, setCateConfigSearch,
        studentSearch, setStudentSearch,
        classSearch, setClassSearch
    }

    return (
        <SearchContext.Provider value={values}>
            {children}
        </SearchContext.Provider>
    )
}

export { SearchProvider, SearchContext }
