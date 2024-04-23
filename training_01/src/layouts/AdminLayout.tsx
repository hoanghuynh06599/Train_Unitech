import { ReactNode, useState } from 'react'
import SideBar from '../components/sideBar/SideBar'

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const [isHiddenSideBar, setIsHiddenSideBar] = useState(false)
    
    return (
        <div className='flex bg-gray-100 min-h-screen gap-4'>
            <div className={`basis-1/5 bg-white ${isHiddenSideBar ? 'hidden' : ''}`}>
                <SideBar  setIsHiddenSideBar={setIsHiddenSideBar} />
            </div>
            <div className={`flex-1  ${isHiddenSideBar ? 'px-10' : ''}`}>
                {children}
            </div>
        </div>
    )
}

export default AdminLayout