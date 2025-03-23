import { CustomSidebarItem } from "./customSidebarItem";
import { ISidebarProps } from "./ISidebar";
import './customSidebar.css'


export const CustomSidebar = ({ sidebarItems, children, classname } : ISidebarProps) => {
    return(
        <div className={classname}>
            {
                sidebarItems?.map((item, index) => (
                    <CustomSidebarItem 
                        {...item}
                        key={index}
                        classname='sidebar-items'
                    />
                ))
            }
            {children}
        </div>
    )
}