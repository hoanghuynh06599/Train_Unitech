import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import CategoriesConfig from "./pages/managements/categoriesConfig/CategoriesConfig"
import axios from "axios"
import EditCategoriesConfig from "./pages/managements/categoriesConfig/EditCategoriesConfig"
import CreateCategoriesConfig from "./pages/managements/categoriesConfig/CreateCategoriesConfig"
import ClassPage from "./pages/managements/class/Class"
import EditClass from "./pages/managements/class/EditClass"
import CreateClass from "./pages/managements/class/CreateClass"
import EditStudent from "./pages/managements/student/EditStudent"
import CreateStudent from "./pages/managements/student/CreateStudent"
import StudentPage from "./pages/managements/student/Student"
import LoginPage from "./pages/auth/Login"
import { useEffect } from "react"
import NotFound from "./pages/notFound/NotFound"

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

const App = () => {
  axios.defaults.baseURL = "http://192.168.5.240/api/"
  axios.defaults.headers["API-Key"] = "0177e09f564ea6fb08fbe969b6c70877"
  const location = useLocation()
  const pathName = location.pathname
  const navigate = useNavigate()


  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          if(await handleCheckToken({ token })) {
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

    if (pathName.includes("administrator")) {
      checkToken()
    }
  }, [navigate, pathName])


  return (
    <Routes>
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route path="/administrator/builder/data">
        <Route path="categories-config" element={<CategoriesConfig />} />
        <Route path="lop-hoc.html" element={<ClassPage />} />
        <Route path="sinh-vien.html" element={<StudentPage />} />
        <Route path="edit">
          <Route path="class/:id" element={<EditClass />} />
          <Route path="categories-config/:id" element={<EditCategoriesConfig />} />
          <Route path="student/:id" element={<EditStudent />} />
        </Route>
        <Route path="create">
          <Route path="categories-config" element={<CreateCategoriesConfig />} />
          <Route path="class" element={<CreateClass />} />
          <Route path="student" element={<CreateStudent />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
