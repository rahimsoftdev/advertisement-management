import { createBrowserRouter } from "react-router"
import MainLayout from "../../layouts/MainLayout"
import HomePage from "../../pages/HomePage"
import PricingPage from "../../pages/PricingPage"

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
    }
])

export default router