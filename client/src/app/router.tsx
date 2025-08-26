import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "@/pages/Landing.Page";

const router = createBrowserRouter([
    {path : '/' , element : <Landing/>},
])

export function Router(){
    return <RouterProvider router={router}/>
}