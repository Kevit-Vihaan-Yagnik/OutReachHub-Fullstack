import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "@/pages/Landing.Page";
import LoginAdmin from "@/pages/AdminLogin.Page";
import DashboardAdmin from "@/pages/AdminDashboard.Page";

const router = createBrowserRouter([
    {path : '/' , element : <Landing/>},
    {path: '/admin/login' , element : <LoginAdmin/>},
    {path: '/admin/dashboard' , element : <DashboardAdmin/>},
])

export function Router(){
    return <RouterProvider router={router}/>
}