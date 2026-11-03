import { createBrowserRouter } from "react-router"
import MainLayout from "../../layouts/MainLayout"
import HomePage from "../../pages/HomePage"
import PricingPage from "../../pages/PricingPage"
import AuthLayout from "../../layouts/AuthLayout"
import Login from "../../pages/Login"
import Register from "../../pages/Register"

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index:true, Component:HomePage
            },
            {
                path:"pricing", Component:PricingPage
            }
        ]
    },
    {
        path:"/",
        Component:AuthLayout,
        children:[
            {
                path:"login", Component:Login
            },
            {
                path:"register", Component:Register
            },
        ]
    }
])

export default router