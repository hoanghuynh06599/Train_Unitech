import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IError, IMenuItem } from "../../services/interfaces"
import { requestWithToken } from "../../hooks/useRequest"


const AppBar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([])

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
                setMenuItems(res.data)
            } catch (error) {
                if ((error as IError).response.status === 401) {
                    navigate("/auth/login")
                } else {
                    console.log({ error });
                }
            }
        }
        hanldeGetData()
    }, [])


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
