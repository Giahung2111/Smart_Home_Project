import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { IDeviceHistoryProps } from "./IHistory";

const columns = [
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

export const History = () => {
  const historyUrl = 'http://127.0.0.1:8000/api/history'
  const [deviceHistory, setDeviceHistory] = useState([]);

  const getDeviceHistory = async () => {
    try {
      const response = await axios.get(historyUrl);
      const data = response.data.data;

      const deviceData = data.map((item : any, index : number) => ({
        key: (index + 1).toString(),
        id: (index + 1),
        device: item.device_name,
        status: item.device_status === false ? "OFF" : "ON",
        time: item.created_at,
        user: item.user_name,
        role: item.user_role,
        room: item.room_name,
      }))

      setDeviceHistory(deviceData);

      console.log("data", deviceData)
    } catch(e) {
      console.log("error: ", e)
    }
  }

  useEffect(() => {
    getDeviceHistory()
  }, [])
  return (
    <div 
      className="p-6 bg-white rounded-xl shadow-md"
      style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
      <h1 className="text-2xl font-semibold mb-4">Device Operating History</h1>

      {/* Table */}
      <Table columns={columns} dataSource={deviceHistory} pagination={{ pageSize: 5 }} />
    </div>
  );
};
