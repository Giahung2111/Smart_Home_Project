import { useNavigate } from "react-router-dom";
import { ISidebarItemProps } from "./ISidebar";

export const CustomSidebarItem: React.FC<ISidebarItemProps> = ({
    label, 
    path, 
    classname, 
    onClick
  }) => {
      const navigate = useNavigate();
      
      const handleClick = () => {
          if (onClick) {
              onClick(label);
          }
          if (path) {
              navigate(path);
          }
      }
  
      return (
          <div onClick={handleClick} className={classname}>
              {label}
          </div>
      )
  }