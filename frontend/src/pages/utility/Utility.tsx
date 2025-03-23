import { Outlet } from "react-router-dom"
import { CustomSidebar } from "../../components/customSidebar/customSidebar"
import { UtitilyConstant } from "../../constants/constants"
import './Utility.css'

export const Utility = () => {
    return (
        <div className="utility-layout">
            <CustomSidebar
                classname="utility-sidebar"
                sidebarItems={UtitilyConstant}>

            </CustomSidebar>

            <div className="utility-content">
                <Outlet />
            </div>
        </div>
    )
}