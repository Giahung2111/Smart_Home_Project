export interface IDashboardUserProps {
    name: string;
    role: string;
    color: string;
    initials: string
}

export interface IDashboardUserResponseProps {
    FullName: string;
    Role: string;
    Avatar: string;
}

export interface IDeviceProps {
    id: number;
    name: string;
    status: boolean;
}