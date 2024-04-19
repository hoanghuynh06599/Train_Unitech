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

const App = () => {
  // axios.defaults.baseURL = "https://660241cf9d7276a75552d8bc.mockapi.io/api/v1"
  axios.defaults.baseURL = "http://192.168.5.240/api/"
  axios.defaults.headers["API-Key"] = "0177e09f564ea6fb08fbe969b6c70877"

  const location = useLocation()
  const pathName = location.pathname
  const navigate = useNavigate()

  useEffect(() => {
    if(pathName.includes("management")) {
      const token = document.cookie?.split("=")[1]
      if(!token) {
        navigate("/auth/login")
      } else {
        axios.defaults.headers["token"] = token
      }
    }
  }, [pathName, navigate])
  

  return (
    <Routes>
      <Route path="/auth">
        <Route  path="login" element={<LoginPage />} />
      </Route>
      <Route path="/management">
        <Route  path="categories-config" element={<CategoriesConfig />} />
        <Route  path="class" element={<ClassPage />} />
        <Route  path="student" element={<StudentPage />} />
        <Route path="edit">
          <Route  path="class/:id" element={<EditClass />} />
          <Route  path="categories-config/:id" element={<EditCategoriesConfig />} />
          <Route  path="student/:id" element={<EditStudent />} />
        </Route>
        <Route path="create">
          <Route  path="categories-config" element={<CreateCategoriesConfig />} />
          <Route  path="class" element={<CreateClass />} />
          <Route  path="student" element={<CreateStudent />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
