import { Avatar, Card, message, Switch } from "antd";
import {
  faLightbulb,
  faDoorClosed,
  faFan,
  faDoorOpen,
  faTemperatureHigh,
  faTemperatureLow,
} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as regularLightbulb } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { deviceAPI } from "../../services/device/deviceAPI";
import { temperatureAPI } from "../../services/temperature/temperatureAPI";
import { memberAPI } from "../../services/member/memberAPI";

export const Dashboard = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [deviceList, setDeviceList] = useState<any>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [userList, setUserList] = useState<UserInfo[]>([]);

  interface User {
    id: number;
    role: string;
    status: boolean;
    fullname: string;
  }

  interface UserInfo {
    name: string;
    role: string;
  }

  const getActiveUserList = async () => {
    try {
      // Gọi API lấy toàn bộ user
      const users: User[] = await memberAPI.getAllUsers();

      if (users?.length) {
        const activeUsers: UserInfo[] = users
          .filter((user) => user.status) 
          .map((user) => ({
            name: user.fullname,
            role: user.role,
          }));

        setUserList(activeUsers);
        console.log("Active Users:", activeUsers);
      }
    } catch (error) {
      console.log("getActiveUserList error >> ", error);
    }
  };

  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 70%)`; // Giữ màu đẹp, không bị chói/tối
  };

  const getDeviceList = async () => {
    try {
      const device = await deviceAPI.getAllDevice();
      if (device?.length) {
        setDeviceList(device);
      }
    } catch (error) {
      console.log("getDeviceList error >> ", error);
    }
  };

  const getTemperature = async () => {
    try {
      // GỌI API đúng chuẩn
      const data = await temperatureAPI.getTemperature();
      console.log("Dữ liệu nhiệt độ trả về:", data); // Phải log ra: { temperature: 27.8 }
      const temp = data?.temperature;
      console.log("Cập nhật nhiệt độ thành công")
      if (temp !== undefined) {
        setTemperature(temp);
      } else {
        console.log("Không lấy được nhiệt độ")
      }
    } catch (error) {
      console.error("Lỗi lấy nhiệt độ:", error);
    }
  };

  useEffect(() => {
    getTemperature(); // Call nhiệt độ từ API
    getDeviceList(); // Call danh sách thiết bị
    getActiveUserList();
  }, []);

  const handleDeviceStatus = async (status: boolean, deviceId: number) => {
    try {
      const res: any = await deviceAPI.updateDeviceStatus(deviceId, status);
      if (res?.id) {
        const device = [...deviceList]?.map((item) => {
          if (item?.id === res?.id) {
            return {
              ...item,
              status: res?.status,
            };
          }
          return item;
        });
        setDeviceList(device);
        messageApi.open({
          type: "success",
          content: "Cập nhật trạng thái thành công",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Cập nhật trạng thái thất bại",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Cập nhật trạng thái thất bại",
      });
    }
  };

  const displayDeviceIcon = (type?: string, status?: boolean) => {
    switch (type) {
      case "light":
        return (
          <FontAwesomeIcon icon={status ? faLightbulb : regularLightbulb} />
        );
      case "fan":
        return <FontAwesomeIcon icon={faFan} spin={status} />;
      case "door":
        return <FontAwesomeIcon icon={status ? faDoorOpen : faDoorClosed} />;
    }
  };

  const displayDeviceStatus = (type?: string, status?: boolean) => {
    switch (type) {
      case "light":
      case "fan":
        return status ? "ON" : "OFF";
      case "door":
        return status ? "OPEN" : "CLOSE";
    }
  };

  return (
    <div className="mt-12 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Member Section */}
        <section className="bg-white rounded-xl h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Member</h2>
          <div className="bg-gray-100 p-4 rounded-xl flex gap-4 flex-wrap">
            {userList.map((member, index) => {
              const bgColor = getColorFromString(member.name); // Màu cố định theo name
              return (
                <div key={index} className="text-center">
                  <Avatar size="large" style={{ backgroundColor: bgColor }}>
                    {member.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </Avatar>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Temperature Section */}
        <section className="bg-white rounded-xl h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Temperature</h2>
          <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-4 w-full justify-center h-full">
            <div className="bg-white p-5 rounded-xl font-bold shadow-md">
              {temperature !== null ? (
                <>
                  <FontAwesomeIcon
                    icon={
                      temperature > 25 ? faTemperatureHigh : faTemperatureLow
                    }
                    className={`text-3xl ${
                      temperature > 25 ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                  <span
                    className={`text-2xl font-bold ${
                      temperature > 25 ? "text-red-500" : "text-blue-500"
                    }`}
                  >
                    {temperature}°C
                  </span>
                </>
              ) : (
                <span>Loading...</span>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Devices Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Devices</h2>
        <div className="bg-gray-100 p-4 rounded-xl">
          <Row gutter={[16, 16]} justify="center">
            {deviceList?.map((item: any, index: number) => {
              return (
                <Col span={8} key={`dashboard-device-${index}`}>
                  <Card className="w-full text-center p-4 shadow-md">
                    <Row gutter={[16, 16]} justify="center">
                      <Col span={8}>
                        <span className="text-2xl">
                          {displayDeviceIcon(
                            item?.devicetype || "",
                            item?.status
                          )}
                        </span>
                      </Col>
                      <Col span={8}>
                        {displayDeviceStatus(
                          item?.devicetype || "",
                          item?.status
                        )}
                      </Col>
                      <Col span={8}>
                        <Switch
                          checked={item?.status}
                          onChange={() =>
                            handleDeviceStatus(!item?.status, item?.id)
                          }
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </section>
      {contextHolder}
    </div>
  );
};
