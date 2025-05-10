import { Tag } from "antd";

export const HistoryTableColumnsConstants = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Device",
      dataIndex: "device",
      key: "device",
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "User name",
      dataIndex: "user",
      key: "user",
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
      render: (status: any) => {
          let color = status === "ON" ? "green" : status === "OFF" ? "red" : "volcano";
          return <Tag color={color}>{status}</Tag>;
        },
    }
  ];
  