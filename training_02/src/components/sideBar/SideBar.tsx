import { MouseEvent, ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IError, ISideBarItem } from "../../services/interfaces"
import { requestWithToken } from "../../hooks/useRequest"
import { AngleDown } from "../icons/Icons"
import { useSearchContext } from "../../hooks/useSearchContext"


type IFunctionClickParent = ({ parentId, e }: { parentId: number, e: MouseEvent<HTMLDivElement, globalThis.MouseEvent> }) => void
interface IParams {
    item: ISideBarItem,
    nodeArr: JSX.Element[],
    countChild: number,
    handleCloseParent: IFunctionClickParent,
    hanldeNavigate: (url: string ) => void
}

const handleRenderChildItem: ({ countChild, item, nodeArr, handleCloseParent }: IParams) => ReactNode = (
    { countChild, item, nodeArr, handleCloseParent, hanldeNavigate }: IParams
) => {
    countChild++
    return (
        <div
            onClick={(e) => item.children.length ? handleCloseParent({ parentId: countChild, e }) : item.url ? hanldeNavigate(item.url) : null}
            className="overflow-hidden h-11"
            data-url={`${item.children.length ? "" : item.url}`}
        >
            <p
                className="py-2.5 px-4 hover:bg-gray-100 rounded-lg cursor-pointer flex items-center justify-between select-none"
                style={{ paddingLeft: countChild * 16 + "px" }}
                id={item.children.length ? `parent-${countChild}` : "no-parent"}
            >
                {item.name}
                {item.children.length ? <span className="pointer-events-none"><AngleDown /></span> : ""}
            </p>
            {
                item.children.length ?
                    item.children.map((child: ISideBarItem) => handleRenderChildItem({ countChild, item: child, nodeArr, handleCloseParent, hanldeNavigate })) :
                    null
            }
        </div>
    )
}

const AppBar = () => {
    const navigate = useNavigate()
    const [menuItems, setMenuItems] = useState<ISideBarItem[]>([])
    const searchContext = useSearchContext()

    const handleLogout = async () => {
        try {
            await requestWithToken({
                url: "v2/auth/logout",
                method: "POST",
                typeAuthorized: "Authorization"
            })

            localStorage.setItem("token", "")
            navigate("/auth/login")
        } catch (error) {
            if ((error as IError).response.status === 401) {
                navigate("/auth/login")
            } else {
                console.log({ error });
            }
        }
    }

    useEffect(() => {
        const hanldeGetData = async () => {
            try {
                const res = await requestWithToken({
                    url: "v2/menu/my-menu",
                    method: "GET",
                    typeAuthorized: "Authorization",
                })
                console.log(res.data);

                setMenuItems(res.data)
            } catch (error) {
                console.log(error);

                if ((error as IError).response.status === 401) {
                    navigate("/auth/login")
                } else {
                    console.log({ error });
                }
            }
        }
        hanldeGetData()
    }, [navigate])

    const handleCloseParent: IFunctionClickParent = ({ e, parentId }) => {
        e.stopPropagation()

        const parentDom = document.getElementById(`parent-${parentId}`)

        if (e.target.id === `parent-${parentId}`) {
            const isParentClose = e.target?.parentNode?.className.includes("h-11")
            if (isParentClose) {
                parentDom?.parentElement?.classList.remove("h-11")
            } else {
                parentDom?.parentElement?.classList.add("h-11")
            }
        }

        const listChildrent = [...e.target.parentNode.getElementsByTagName("div")]
        for (let i = 0; i < listChildrent.length - 1; i++) {
            if (listChildrent[i].dataset.url && listChildrent[i].dataset.url.includes("/administrator/internship")) {
                searchContext?.setClassSearch("")
                searchContext?.setFolderSearch("")
                searchContext?.setFormSearch("")
                searchContext?.setStudentSearch("")
                navigate(listChildrent[i].dataset.url)
                break
            }
        }
    }

    const hanldeNavigate = (url: string) => {
        searchContext?.setClassSearch("")
        searchContext?.setFolderSearch("")
        searchContext?.setFormSearch("")
        searchContext?.setStudentSearch("")
        navigate(url)
    }

    const handleReturnMenuItem = (meuItem: ISideBarItem) => {
        if (meuItem.children.length) {
            const nodeArr: JSX.Element[] = []
            const countChild = 0

            return (
                <li>
                    {handleRenderChildItem({ item: meuItem, nodeArr, countChild, handleCloseParent, hanldeNavigate })}
                </li>
            )
        } else {
            return (
                <li onClick={() => navigate(meuItem.url)}>
                    <p className="py-2.5 px-4 hover:bg-gray-100 rounded-lg cursor-pointer flex items-center justify-between">
                        <span>{meuItem.name}</span>
                    </p>
                </li>
            )
        }
    }

    return (
        <div className={`flex-col pb-2 h-full flex`}>
            <h2 className="text-3xl font-semibold text-center py-5">SideBar</h2>
            <div className="flex-1">
                <ul className="px-1.5 space-y-2">
                    {
                        menuItems.map((item: ISideBarItem) => handleReturnMenuItem(item))
                    }
                </ul>
            </div>
            <div className="px-1.5">
                <p className="py-2.5 px-4 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={handleLogout}>
                    Đăng xuất
                </p>
            </div>
        </div>
    )
}

export default AppBar
