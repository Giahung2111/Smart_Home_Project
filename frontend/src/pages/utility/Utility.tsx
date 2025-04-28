import { Outlet } from "react-router-dom"
import { CustomSidebar } from "../../components/customSidebar/customSidebar"
import { UtitilyConstant } from "../../constants/UtilityPageConstants"
import './Utility.css'

export const Utility = () => {
    return (
        <div 
            className="utility-layout"
        >
            <CustomSidebar
                classname="utility-sidebar"
                sidebarItems={UtitilyConstant} />

            <div 
                className="utility-content"
                style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
                <Outlet />
            </div>
        </div>
    )
}