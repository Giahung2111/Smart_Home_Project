
export interface ISidebarItemProps {
    label: string;
    classname?: string;
    path?: string;
    page?: React.ReactNode;
    onClick?: (item : any) => void;
}

export interface ISidebarProps {
    sidebarItems?: ISidebarItemProps[];
    children?: React.ReactNode;
    classname?: string;
    onItemClick?: (item : any) => void;
}