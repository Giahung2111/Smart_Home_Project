import { useNavigate } from "react-router-dom";
import { ISidebarItemProps } from "./ISidebar";

export const CustomSidebarItem : React.FC<ISidebarItemProps> = ({label, path, classname}) => {
    const navigate = useNavigate();
    const onNavigate = (pathValue: string) => {
        navigate(pathValue)
    }

    return(
        <div onClick={() => onNavigate(path)} className={classname}>
            {label}
        </div>
    )
}