import { Outlet } from "react-router-dom"
import { CustomSidebar } from "../../components/customSidebar/customSidebar"
import { SettingsConstant } from "../../constants/constants"
import './Settings.css'

export const Settings = () => {
    return(
        <div className="settings-layout">
            <CustomSidebar
                sidebarItems={SettingsConstant}
                classname="settings-sidebar"
            />
            
            <div className="settings-content">
                <Outlet />
            </div>
        </div>
    )
}