import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="flex w-screen h-screen items-center justify-center flex-col gap-10">
            <h1 className="text-3xl font-semibold">Page Not Found</h1>
            <p className="cursor-pointer hover:underline" onClick={() => navigate("/administrator/builder/data/lop-hoc.html")}>
                Go to dashboard
            </p>
        </div>
    )
}

export default NotFound