import { useEffect, useState } from 'react'
import SideBar from '../components/sideBar/SideBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ActionFormField from '../components/dialog/ActionFormField'
import DeleteFormField from '../components/dialog/DeleteFormField'
import { useDialogContext } from '../hooks/useDialog'


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
    const dialogContext = useDialogContext()
    const location = useLocation()
    const [isHideSideBar, setIsHideSideBar] = useState(false)

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

    useEffect(() => {
        if(location.pathname.includes("/form-field")) {
            setIsHideSideBar(true)
        } else {
            setIsHideSideBar(false)
        }
    }, [navigate])
    

    return (
        <div className='flex bg-gray-100 gap-4 w-full min-h-screen'>
            <div className={`basis-1/5 bg-white ${isHideSideBar ? 'hidden' : 'block'}`}>
                <SideBar />
            </div>
            <div className={`flex-1`}>
                <Outlet />
            </div>
            {
                dialogContext?.isOpen && (
                    <>
                        <ActionFormField />
                        <DeleteFormField />
                    </>
                )
            }
        </div>
    )
}

export default AdminLayout