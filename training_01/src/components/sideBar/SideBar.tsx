import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"

const listManagements = [
    {
        id: 1,
        name: "Danh mục cấu hình",
        sufixPath: "categories-config",
        path: "/management/categories-config"
    },
    {
        id: 2,
        name: "Lớp học",
        sufixPath: "class",
        path: "/management/class"
    },
    {
        id: 3,
        name: "Sinh viên",
        sufixPath: "student",
        path: "/management/student"
    },
]

const AppBar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        try {
            await axios.post("v2/auth/logout")
            document.cookie = "token" + "=; expires=" + +new Date
            navigate("/auth/login")
        } catch (error) {
            console.log({ error });

        }
    }

    return (
        <div className="flex flex-col pb-2 h-full">
            <h2 className="text-3xl font-semibold text-center py-5">SideBar</h2>
            <div className="flex-1">
                <ul className="px-1.5 space-y-2">
                    {
                        listManagements.map(item => (
                            <li
                                className={`py-2.5 px-4 hover:bg-gray-100 rounded-lg cursor-pointer ${location.pathname.includes(item.sufixPath) ? "bg-gray-100" : ''}`}
                                key={item.id}
                                onClick={() => navigate(item.path)}
                            >
                                {item.name}
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
