import { MouseEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { request } from "../../hooks/useRequest"
import { useDialogContext } from "../../hooks/useDialog"

const LoginPage = () => {
    const dialogContext = useDialogContext()
    const [userInfo, setUserInfo] = useState({
        username: "admin",
        password: "Abc@1234",
        remember: false
    })

    const [isLoginFailed, setIsLoginFailed] = useState(false)
    
    const navigate = useNavigate()

    const handleLogin = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        if (userInfo.password && userInfo.username) {
            try {
                const res = await request({
                    url: "v2/auth/login",
                    body: userInfo,
                    method: "POST",
                })

                if(!res.status) {
                    setIsLoginFailed(true)
                } else {
                    dialogContext?.handleCloseDialog()
                    localStorage.setItem("token", res.data.token)
                    navigate("/administrator/builder/data/lop-hoc.html")
                }
            } catch (error) {
                console.log({ error });
            }
        } else {
            setIsLoginFailed(true)
        }
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="shadow p-8 w-96">
                <h3 className="text-2xl font-semibold mb-6">Sign in to your account</h3>
                <div className="mb-5 w-full">
                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900">Your name</label>
                    <input
                        type="text"
                        id="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Abc"
                        required
                        value={userInfo.username}
                        onChange={(e) => setUserInfo({
                            ...userInfo,
                            username: e.target.value
                        })}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                    <input
                        type="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        value={userInfo.password}
                        onChange={(e) => setUserInfo({
                            ...userInfo,
                            password: e.target.value
                        })}
                    />
                </div>
                {isLoginFailed && <p className="text-sm text-red-600 mb-5">Username not found and/or password is incorrect</p>}
                <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                        <input
                            id="remember"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                            required
                            checked={userInfo.remember}
                            onChange={(e) => setUserInfo({
                                ...userInfo,
                                remember: e.target.checked
                            })}
                        />
                    </div>
                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900">Remember me</label>
                </div>
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" onClick={handleLogin}>Submit</button>
            </div>
        </div>
    )
}

export default LoginPage
