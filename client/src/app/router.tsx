import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "@/pages/Landing.Page";
import LoginAdmin from "@/pages/AdminLogin.Page";
import DashboardPage from "@/pages/Dashboard.Page";
import Home from "@/features/admin-dashboard/components/Home";
import Workspace from "@/features/workspace/components/Workspace";
import LoginUser from "@/pages/UserLogin.Page";
import UserDashboardPage from "@/pages/UserDashboard.Page";
import UserHome from "@/features/user-dashboard/components/UserHome";
import WorkspacePicker from "@/features/user-dashboard/components/WorkspacePicker";
import Contact from "@/features/contact/components/Contact";
import MessageTemplate from "@/features/message-template/components/MessageTemplate";

const router = createBrowserRouter([
    {path : '/' , element : <Landing/>},
    {path: '/admin/login' , element : <LoginAdmin/>},
    {path: '/admin/dashboard' , element : <DashboardPage/>, children : [
        {path : '' , element: <Home/>},
        {path : 'workspace' , element : <Workspace/>}
    ]},
    {path: '/user/login' , element : <LoginUser/>},
    {path: '/user/workspace-picker' , element : <WorkspacePicker/>},
    {path: '/user/dashboard' , element : <UserDashboardPage/> , children: [
        {path : '' , element : <UserHome/>},
        {path : 'contacts' , element : <Contact/>},
        {path : 'templates' , element : <MessageTemplate/>}
    ]},
])

export function Router(){
    return <RouterProvider router={router}/>
}