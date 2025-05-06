import { Avatar, Card, message, Switch } from "antd";
import {
  faLightbulb,
  faDoorClosed,
  faFan,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as regularLightbulb } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import axios from "axios";
import { IDashboardUserProps, IDashboardUserResponseProps } from "./IDashBoard";
import { getShortenName } from "../../utils/util";
import { DashboardAPI } from "../../services/dashboard/dashboardAPI";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [light, setLight] = useState({ id: 0, name: '', status: false });
  const [fan, setFan] = useState({ id: 0, name: '', status: false });
  const [door, setDoor] = useState({ id: 0, name: '', status: false });
  const memberUrl = DashboardAPI.getAllMembersUrl;
  const livingRoomUrl = DashboardAPI.getAllDevicesInLivingRoomUrl;
  const deviceUrl = DashboardAPI.updateDeviceUrl;
  const [users, setUsers] = useState<IDashboardUserProps[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const getAllUsers = async () => {
    try {
      const response = await axios.get(memberUrl);

      if (response.data.status === 200) {
        const data = response.data.data;
        const usersData = data.map((user: IDashboardUserResponseProps) => ({
          name: user.FullName,
          role: user.Role,
          color: user.Avatar,
          initials: getShortenName(user.FullName)
        }))

        setUsers(usersData)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllDevicesInLivingRoom = async () => {
    const response = await axios.get(livingRoomUrl);
    const data = response.data.data['living room']['devices'];

    console.log(data);

    for (let i = 0; i < data.length; i++) {
      if (data[i].device_name == "fan") {
        setFan({
          id: data[i].id,
          name: data[i].device_name,
          status: data[i].status
        })
      }

      if (data[i].device_name == "door") {
        setDoor({
          id: data[i].id,
          name: data[i].device_name,
          status: data[i].status
        });
      }

      if (data[i].device_name == "light 4") {
        setLight({
          id: data[i].id,
          name: data[i].device_name,
          status: data[i].status
        });
      }
    }
  }

  const handleUpdateDeviceStatus = async (id: number, status: boolean) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') as string);
      console.log("Current user: ", currentUser);
      const response = await axios.patch(`${deviceUrl}${id}/`, {
        status: status,
        userID: currentUser.id,
      });
      console.log(response.data)
      if (response?.data?.data?.id) {
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    getAllUsers();
    getAllDevicesInLivingRoom();
  }, [])

  return (
    <div
      className="p-6 space-y-6"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      {/* Member Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Member</h2>
        <div
          className="bg-gray-100 p-4 rounded-xl flex gap-4"
          style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
          {users.map((member, index) => (
            <div key={index} className="text-center">
              <Avatar size="large" style={{ backgroundColor: member.color }}>
                {member.initials}
              </Avatar>
              <p className="font-semibold">{member.name}</p>
              <p className="text-gray-500 text-sm" style={{ color: 'var(--text-color)' }}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2
          className="text-xl font-semibold mb-4">Devices</h2>
        <div
          className="bg-gray-100 p-4 rounded-xl"
          style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
          <Row gutter={[16, 16]} justify="center">
            <Col span={8}>
              <Card className="w-full text-center p-4 shadow-md">
                <Row gutter={[16, 16]} justify="center">
                  <Col span={8}>
                    <span className="text-2xl">
                    <FontAwesomeIcon icon={light.status ? faLightbulb : regularLightbulb} />
                    </span>
                  </Col>
                  <Col span={8}>
                    <p className="font-semibold">{light.status ? "ON" : "OFF"}</p>
                  </Col>
                  <Col span={8}>
                    <Switch
                      checked={light.status}
                      onChange={async () => {
                        const updateStatus = !light.status;
                        const res = await handleUpdateDeviceStatus(light.id, updateStatus);

                        if (res) {
                          setLight({ ...light, status: updateStatus })
                          messageApi.open({
                            type: 'success',
                            content: `Turned ${updateStatus ? "ON" : "OFF"} the Light`,
                          });
                        }
                        else {
                          messageApi.open({
                            type: 'error',
                            content: `Failed to turn ${updateStatus ? "ON" : "OFF"} the Light`,
                          });
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card className="w-full text-center p-4 shadow-md">
                <Row gutter={[16, 16]} justify="center">
                  <Col span={8}>
                    <span className="text-2xl">
                      <FontAwesomeIcon icon={faFan} spin={fan.status} />
                    </span>
                  </Col>
                  <Col span={8}>
                    <p className="font-semibold">{fan.status ? "ON" : "OFF"}</p>
                  </Col>
                  <Col span={8}>
                    {/* <Switch
                      checked={fan.status}
                      onChange={() => {
                        setFan({ ...fan, status: !fan.status })
                        handleUpdateDeviceStatus(fan.id, !fan.status);
                      }}
                    /> */}
                    <Switch
                      checked={fan.status}
                      onChange={async () => {
                        const updateStatus = !fan.status;
                        const res = await handleUpdateDeviceStatus(fan.id, updateStatus);

                        if (res) {
                          setFan({ ...fan, status: updateStatus });
                          messageApi.success(`Fan turned ${updateStatus ? "ON" : "OFF"}`);
                        } else {
                          messageApi.error(`Failed to update fan status`);
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card className="w-full text-center p-4 shadow-md">
                <Row gutter={[16, 16]} justify="center">
                  <Col span={8}>
                    <span className="text-2xl">
                      <FontAwesomeIcon icon={door.status ? faDoorOpen : faDoorClosed} />
                    </span>
                  </Col>
                  <Col span={8}>
                    <p className="font-semibold">{door.status ? "OPEN" : "CLOSE"}</p>
                  </Col>
                  <Col span={8}>
                    {/* <Switch
                      checked={door.status}
                      onChange={() => {
                        setDoor({ ...door, status: !door.status })
                        handleUpdateDeviceStatus(door.id, !door.status);
                      }}
                    /> */}
                    <Switch
                      checked={door.status}
                      onChange={async () => {
                        const updateStatus = !door.status;
                        const res = await handleUpdateDeviceStatus(door.id, updateStatus);

                        if (res) {
                          setDoor({ ...door, status: updateStatus });
                          messageApi.success(`Door ${updateStatus ? "opened" : "closed"}`);
                        } else {
                          messageApi.error(`Failed to update door status`);
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
      {contextHolder}
    </div>
  );
};
