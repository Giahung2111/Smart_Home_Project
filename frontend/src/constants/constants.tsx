import React from 'react';
import { Button, Space, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SettingsPersonalInformation } from '../pages/setting/SettingsPersonalInformation';
import { SettingsTheme } from '../pages/setting/SettingsTheme';
import { ISidebarItemProps } from '../components/customSidebar/ISidebar';
import { UtilityFaceRecognitionPage } from '../pages/utility/UtilityFaceRecognitionPage';
import { UtilitySpeechRecognitionPage } from '../pages/utility/UtilitySpeechRecognitionPage';


export const ITEM_PER_PAGE = 10;

export const MemberPageColumns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
    },
    {
        title: "Role",
        dataIndex: "role",
        key: "role",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => <Tag color={status==="Active"?"green":"red"}>{status}</Tag>
    }
]

export const ActionsColumn = {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: () => {
        return(
            <Space>
                <Button type="link" icon={<EditOutlined />} />
                <Button type="link" danger icon={<DeleteOutlined />} />
            </Space>
        )
    }
}

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

export const UtitilyConstant : ISidebarItemProps[] = [
    {
        label: 'Face Recognition',
        path: '/utility/face-regconition',
        page: <UtilityFaceRecognitionPage />
    },
    {
        label: 'Speech Recognition',
        path: 'utility/speech-recognition',
        page: <UtilitySpeechRecognitionPage />
    }
]