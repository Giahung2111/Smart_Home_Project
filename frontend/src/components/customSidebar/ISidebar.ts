import { ISidebarRoutes } from "./ISidebarRoutes";

export interface ISidebarItemProps extends ISidebarRoutes {
    label: string;
    classname?: string;
}

export interface ISidebarProps {
    sidebarItems?: ISidebarItemProps[];
    children?: React.ReactNode;
    classname?: string;
}