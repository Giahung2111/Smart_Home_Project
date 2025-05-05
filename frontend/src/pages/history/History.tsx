import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import axios from "axios";
import { HistoryTableColumnsConstants } from "../../constants/HistoryPageConstant";
import { HistoryAPI } from "../../services/history/History";
import { IDeviceHistoryProps } from "./IHistory";

export const History = () => {
  const historyUrl = `${HistoryAPI.getDeviceHistory}`;
  const [deviceHistory, setDeviceHistory] = useState<IDeviceHistoryProps[]>([]);

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
      <Table columns={HistoryTableColumnsConstants} dataSource={deviceHistory} pagination={{ pageSize: 5 }} />
    </div>
  );
};
