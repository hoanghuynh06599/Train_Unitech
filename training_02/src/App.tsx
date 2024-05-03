import { Routes, Route, useNavigate } from "react-router-dom"
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
import AdminLayout from "./layouts/AdminLayout"
import FolderPage from "./pages/managements/folder/Folder"
import CreateFolder from "./pages/managements/folder/CreateStudent"
import EditFolder from "./pages/managements/folder/EditStudent"
import EditForm from "./pages/managements/form/EditStudent"
import CreateForm from "./pages/managements/form/CreateForm"
import FormPage from "./pages/managements/form/Form"

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
  }, [navigate])


  return (
    <div className='flex bg-gray-100 min-h-screen gap-4'>
      <Routes>
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/administrator" element={<AdminLayout />} >
          <Route path="builder/data" >
            <Route path="categories-config" element={<CategoriesConfig />} />
            <Route path="lop-hoc.html" element={<ClassPage />} />
            <Route path="sinh-vien.html" element={<StudentPage />} />
            <Route path="edit">
              <Route path="class/:id" element={<EditClass />} />
              <Route path="categories-config/:id" element={<EditCategoriesConfig />} />
              <Route path="student/:id" element={<EditStudent />} />
              <Route path="folder/:id" element={<EditFolder />} />
              <Route path="form/:id" element={<EditForm />} />
            </Route>
            <Route path="create">
              <Route path="categories-config" element={<CreateCategoriesConfig />} />
              <Route path="class" element={<CreateClass />} />
              <Route path="student" element={<CreateStudent />} />
              <Route path="folder" element={<CreateFolder />} />
              <Route path="form" element={<CreateForm />} />
            </Route>
          </Route>

          <Route path="internship/builder/">
            <Route path="folder.html"  element={<FolderPage />} />
            <Route path="form.html"  element={<FormPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
