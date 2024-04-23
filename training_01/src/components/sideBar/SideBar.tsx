import axios from "axios"
import { Dispatch, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface IMenuItem {
    id: number
    name: string
    pageTitle: string
    url: string
}

const AppBar = ({setIsHiddenSideBar}: {setIsHiddenSideBar: Dispatch<React.SetStateAction<boolean>>}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([])

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token")
            await axios.post("v2/auth/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            localStorage.setItem("token", "")
            navigate("/auth/login")
        } catch (error) {
            console.log({ error });
        }
    }

    useEffect(() => {
        const hanldeGetData = async () => {
            const token = localStorage.getItem("token")
            const res = await axios.get("v2/menu/my-menu", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMenuItems(res.data.data)
        }


        hanldeGetData()
    }, [])

    useEffect(() => {
        if (location.pathname.includes("create") || location.pathname.includes("edit")) {
            setIsHiddenSideBar(true)
        } else {
            setIsHiddenSideBar(false)
        }
    }, [location.pathname, setIsHiddenSideBar])



    return (
        <div className={`flex-col pb-2 h-full flex`}>
            <h2 className="text-3xl font-semibold text-center py-5">SideBar</h2>
            <div className="flex-1">
                <ul className="px-1.5 space-y-2">
                    {
                        menuItems.map(item => (
                            <li
                                className={`
                                    py-2.5 px-4 hover:bg-gray-100 rounded-lg cursor-pointer 
                                    ${location.pathname.includes(item.url) ? 'bg-gray-100' : ''}`}
                                key={item.id}
                                onClick={() => navigate(item.url)}
                            >
                                {item.pageTitle}
                            </li>
                        ))
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
