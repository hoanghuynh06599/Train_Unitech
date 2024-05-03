import SideBar from '../components/sideBar/SideBar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div className='flex bg-gray-100 min-h-screen gap-4 w-full'>
            <div className={`basis-1/5 bg-white`}>
                <SideBar  />
            </div>
            <div className={`flex-1`}>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout