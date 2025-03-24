import { ISidebarItemProps } from "../components/customSidebar/ISidebar";
import { SettingsPersonalInformation } from "../pages/setting/SettingsPersonalInformation";
import { SettingsTheme } from "../pages/setting/SettingsTheme";

export const SettingsConstant : ISidebarItemProps[] = [
    {
        label: 'Personal Information',
        path: '/setting/personal-info',
        page: <SettingsPersonalInformation />,
    },
    {
        label: 'Theme',
        path: '/setting/theme',
        page: <SettingsTheme />
    }
]