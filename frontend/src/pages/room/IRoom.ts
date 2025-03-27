import { ISidebarItemProps } from "../../components/customSidebar/ISidebar";

interface IDeviceProps {
    name: string;
    icon: React.ReactNode;
    isConnected: boolean;
}

export interface IRoomProps extends ISidebarItemProps {
    devices: IDeviceProps[] | null;
}