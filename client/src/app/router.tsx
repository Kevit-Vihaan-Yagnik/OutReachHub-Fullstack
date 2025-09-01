import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "@/pages/Landing.Page";
import LoginAdmin from "@/pages/AdminLogin.Page";
import DashboardPage from "@/pages/Dashboard.Page";
import Home from "@/features/admin-dashboard/components/Home";
import Workspace from "@/features/workspace/components/Workspace";

const router = createBrowserRouter([
    {path : '/' , element : <Landing/>},
    {path: '/admin/login' , element : <LoginAdmin/>},
    {path: '/admin/dashboard' , element : <DashboardPage/>, children : [
        {path : '' , element: <Home/>},
        {path : 'workspace' , element : <Workspace/>}
    ]},
])

export function Router(){
    return <RouterProvider router={router}/>
}