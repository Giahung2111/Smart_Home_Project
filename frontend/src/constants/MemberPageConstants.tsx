import { Tag } from "antd"

export const MemberPageColumns = [
    {
        title: "Name",
        dataIndex: "FullName",
        key: "Name",
    },
    // {
    //     title: "Email",
    //     dataIndex: "email",
    //     key: "email",
    // },
    {
        title: "Phone",
        dataIndex: "Phone",
        key: "Phone",
    },
    {
        title: "Role",
        dataIndex: "Role",
        key: "Role",
    },
    {
        title: "Status",
        dataIndex: "Status",
        key: "Status",
        render: (status: string) => <Tag color={status==="Active"?"green":"red"}>{status}</Tag>
    }
]

export const UserRoleConstant = [
    {
        label: "Admin",
        value: "admin"
    },
    {
        label: "User",
        value: "user"
    }
]
