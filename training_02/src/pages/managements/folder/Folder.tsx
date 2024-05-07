import { MouseEvent, Suspense, lazy, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchContext } from "../../../hooks/useSearchContext"
import { requestWithToken } from "../../../hooks/useRequest"
import { AngleDown } from "../../../components/icons/Icons"
import { IError, ISubItemSideBarItem } from "../../../services/interfaces"
const ListFolder = lazy(() => import("../../../components/folder/ListFolders"))

type IFunctionClickParent = ({ e }: { e: MouseEvent<HTMLLIElement, globalThis.MouseEvent> }) => void
const handleRenderChildItem = ({ 
    item, 
    countChild, 
    handleCloseParent 
}: { item: ISubItemSideBarItem, countChild: number, handleCloseParent: IFunctionClickParent }) => {
    countChild++
    if (item.children.length) {
        return (
            <li 
                onClick={(e) => item.children.length ? handleCloseParent({ e }) : null}
                className="overflow-hidden h-11"
                id={`sub-menu-${item.id}`}
                data-id={item.id}
            >
                <p
                    className="py-2.5 px-4 hover:bg-gray-100 rounded-lg cursor-pointer flex items-center justify-between select-none"
                    style={{ paddingLeft: countChild * 16 + "px" }}
                >
                    {item.name}
                    {item.children.length ? <span className="pointer-events-none"><AngleDown /></span> : ""}
                </p>
                {
                    item.children.length ?
                        item.children.map((child: ISubItemSideBarItem) => handleRenderChildItem({ item: child, countChild, handleCloseParent })) :
                        null
                }
            </li>
        )
    } else {
        return (
            <div>
                <p 
                    className="py-2.5 px-4 hover:bg-gray-100 rounded-lg cursor-pointer flex items-center justify-between"
                    style={{ paddingLeft: countChild * 16 + "px" }}
                >
                    <span>{item.name}</span>
                </p>
            </div>
        )
    }
}

const FolderPage = () => {
    const [searchValue, setSearchValue] = useState("")
    const searchContext = useSearchContext()
    const navigate = useNavigate()
    const [currMenuOpen, setCurrMenuOpen] = useState("")
    const [menuItems, setMenuItems] = useState<ISubItemSideBarItem[]>([])

    const handleSearch = () => {
        searchContext?.setFolderSearch(searchValue)
    }

    const handleCloseParent: IFunctionClickParent = ({ e }) => {
        e.stopPropagation();
        const parentDom = e.target?.parentNode
        const parentId = parentDom.dataset.id;

        if(currMenuOpen !== "") {
            const menuOpen = document.getElementById(currMenuOpen);
            menuOpen?.classList.add("h-11")
        }
        
        searchContext?.setFolderSearchByParent(parentId)
        if(parentDom.className.includes("h-11")) {
            parentDom.classList.remove("h-11")
            setCurrMenuOpen(`sub-menu-${parentId}`)
        } else {
            parentDom.classList.add("h-11")
        }
    }

    useEffect(() => {
        const handleGetSubMenu = async () => {
            try {
                const res = await requestWithToken({
                    url: "v1/folder/tree",
                    method: "GET",
                    typeAuthorized: "Token"
                })

                setMenuItems(res.data)

            } catch (error) {
                if ((error as IError).response.status === 401) {
                    navigate("/auth/login")
                }
                console.log(error);
            }
        }

        handleGetSubMenu()
    }, [])


    return (
        <div className="mt-5">
            <h3 className="py-4 my-6 text-3xl font-semibold">Folder</h3>
            <div className="bg-white"></div>
            <div className="bg-white">
                <div className="flex justify-end p-6">
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                        onClick={() => navigate("/administrator/builder/data/create/folder")}
                    >
                        Tạo mới
                    </button>
                </div>

                <div className="flex justify-end pr-6">
                    <div className="max-w-md min-w-[24rem]">
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tên thư mục"
                                required
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <button type="submit" className="text-white absolute end-1.5 bottom-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2" onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="mx-6 mt-4 max-h-fit">
                        <ul className="bg-gray-50 py-4 px-2 space-y-2">
                            {
                                menuItems.map((item: ISubItemSideBarItem) => handleRenderChildItem({ item, countChild: 0, handleCloseParent }))
                            }
                        </ul>
                    </div>

                    <Suspense fallback={<h1>Loading.....</h1>}>
                        <ListFolder />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default FolderPage
