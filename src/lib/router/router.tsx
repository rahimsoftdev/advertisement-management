import { createBrowserRouter } from "react-router"
import MainLayout from "../../layouts/MainLayout"
import HomePage from "../../pages/HomePage"
import PricingPage from "../../pages/PricingPage"
import AuthLayout from "../../layouts/AuthLayout"
import Login from "../../pages/Login"
import Register from "../../pages/Register"
import AboutPage from "../../pages/AboutPage"
// import HowItWork from "../../pages/HowItWorkPage"
import HowItWorkPage from "../../pages/HowItWorkPage"
import MentionsLegalesPage from "../../pages/MentionsLegalesPage"
import AnnouncementPage from "../../pages/AnnouncementPage"

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
            },
            {
                path:"about", Component:AboutPage
            },
            {
                path:"how-work", Component:HowItWorkPage
            },
            {
                path:"rolse", Component:MentionsLegalesPage
            },
            {
                path:"announcement/new", Component:AnnouncementPage
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