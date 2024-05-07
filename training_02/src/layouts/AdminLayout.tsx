import { useEffect } from 'react'
import SideBar from '../components/sideBar/SideBar'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'


const handleCheckToken = async ({ token }: { token: string }) => {
    try {
        return await axios.get("v2/auth/check", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const AdminLayout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    if (await handleCheckToken({ token })) {
                        // console.log("OK");
                    } else {
                        navigate("/auth/login")
                    }
                } catch (error) {
                    console.log({ error });
                }
            } else {
                navigate("/auth/login")
            }
        }

        checkToken()
    }, [])

    return (
        <div className='flex bg-gray-100 min-h-screen gap-4 w-full'>
            <div className={`basis-1/5 bg-white`}>
                <SideBar />
            </div>
            <div className={`flex-1`}>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout