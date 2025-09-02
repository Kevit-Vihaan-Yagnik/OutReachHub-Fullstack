import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "@/pages/Landing.Page";
import LoginAdmin from "@/pages/AdminLogin.Page";
import DashboardPage from "@/pages/Dashboard.Page";
import Home from "@/features/admin-dashboard/components/Home";
import Workspace from "@/features/workspace/components/Workspace";
import LoginUser from "@/pages/UserLogin.Page";

const router = createBrowserRouter([
    {path : '/' , element : <Landing/>},
    {path: '/admin/login' , element : <LoginAdmin/>},
    {path: '/admin/dashboard' , element : <DashboardPage/>, children : [
        {path : '' , element: <Home/>},
        {path : 'workspace' , element : <Workspace/>}
    ]},
    {path: '/user/login' , element : <LoginUser/>}
])

export function Router(){
    return <RouterProvider router={router}/>
}