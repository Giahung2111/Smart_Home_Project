import { Outlet } from "react-router-dom"
import { CustomSidebar } from "../../components/customSidebar/customSidebar"
import './Settings.css'
import { SettingsConstant } from "../../constants/SettingsPageConstants"

export const Settings = () => {
    return(
        <div className="settings-layout">
            <CustomSidebar
                sidebarItems={SettingsConstant}
                classname="settings-sidebar"
            />
            
            <div 
                className="settings-content"
                style={{backgroundColor: 'var(--shadow-color)'}}
            >
                <Outlet />
            </div>
        </div>
    )
}