import { CustomSidebarItem } from "./customSidebarItem";
import { ISidebarProps } from "./ISidebar";
import './customSidebar.css'


export const CustomSidebar = ({ sidebarItems, children, classname, onItemClick }: ISidebarProps) => {
    return (
        <div className={classname}>
            {
                sidebarItems?.map((item, index) => (
                    <CustomSidebarItem 
                        {...item}
                        key={index}
                        classname='sidebar-items'
                        onClick={() => onItemClick && onItemClick(item)}
                    />
                ))
            }
            {children}
        </div>
    )
}