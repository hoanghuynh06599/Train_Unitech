import { ReactNode } from 'react'
import SideBar from '../components/sideBar/SideBar'

const AdminLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex bg-gray-100 min-h-screen gap-4'>
            <div className="basis-1/5 bg-white">
                <SideBar />
            </div>
            <div className="basis-4/5">
                {children}
            </div>
        </div>
    )
}

export default AdminLayout