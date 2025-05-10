import { Avatar, Card, Switch } from "antd";
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
  const [light, setLight] = useState({id: 0, name: '', status: false});
  const [fan, setFan] = useState({id: 0, name: '', status: false});
  const [door, setDoor] = useState({id: 0, name: '', status: false});
  const memberUrl = DashboardAPI.getAllMembersUrl;
  const livingRoomUrl = DashboardAPI.getAllDevicesInLivingRoomUrl;
  const deviceUrl = DashboardAPI.updateDeviceUrl;
  const [users, setUsers] = useState<IDashboardUserProps[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(memberUrl);
      
      if(response.data.status === 200) {
        const data = response.data.data;
        const usersData = data.map((user : IDashboardUserResponseProps) => ({
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
      if(data[i].device_name == "fan") {
        setFan({
          id: data[i].id,
          name: data[i].device_name,
          status: data[i].status
        })
      }

      if(data[i].device_name == "door") {
        setDoor({
          id: data[i].id,
          name: data[i].device_name,
          status: data[i].status
        });
      }

      if(data[i].device_name == "light 4") {
        setLight({
          id: data[i].id,
          name: data[i].device_name,
          status: data[i].status
        });
      }
    }
  }

  const handleUpdateDeviceStatus = async (id: number, status : boolean) => {
    const currentUser = JSON.parse(localStorage.getItem('user') as string);
    console.log("Current user: ", currentUser);
    const response = await axios.patch(`${deviceUrl}${id}`, {
      status : status,
      userID : currentUser.id,
    });

    console.log(response.data)
  }

  useEffect(() => {
    getAllUsers();
    getAllDevicesInLivingRoom();
  }, [])

  return (
    <div 
      className="p-6 space-y-6"
      style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
      {/* Member Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Member</h2>
        <div 
        className="bg-gray-100 p-4 rounded-xl flex gap-4"
        style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
          {users.map((member, index) => (
            <div key={index} className="text-center">
              <Avatar size="large" style={{ backgroundColor: member.color }}>
                {member.initials}
              </Avatar>
              <p className="font-semibold">{member.name}</p>
              <p className="text-gray-500 text-sm" style={{color: 'var(--text-color)'}}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 
          className="text-xl font-semibold mb-4">Devices</h2>
        <div 
        className="bg-gray-100 p-4 rounded-xl"
        style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
          <Row gutter={[16, 16]} justify="center">
            <Col span={8}>
              <Card className="w-full text-center p-4 shadow-md">
                <Row gutter={[16, 16]} justify="center">
                  <Col span={8}>
                    <span className="text-2xl">
                      <FontAwesomeIcon icon={light ? faLightbulb : regularLightbulb} />
                    </span>
                  </Col>
                  <Col span={8}>
                    <p className="font-semibold">{light ? "ON" : "OFF"}</p>
                  </Col>
                  <Col span={8}>
                    <Switch 
                      checked={light.status} 
                      onChange={() => {
                        setLight({...light, status: !light.status})
                        handleUpdateDeviceStatus(light.id, !light.status);
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
                    <p className="font-semibold">{fan ? "ON" : "OFF"}</p>
                  </Col>
                  <Col span={8}>
                    <Switch 
                    checked={fan.status} 
                    onChange={() => {
                      setFan({...fan, status: !fan.status})
                      handleUpdateDeviceStatus(fan.id, !fan.status);
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
                      <FontAwesomeIcon icon={door ? faDoorOpen : faDoorClosed} />
                    </span>
                  </Col>
                  <Col span={8}>
                    <p className="font-semibold">{door ? "OPEN" : "CLOSE"}</p>
                  </Col>
                  <Col span={8}>
                    <Switch 
                    checked={door.status} 
                    onChange={() => {
                      setDoor({...door, status: !door.status})
                      handleUpdateDeviceStatus(door.id, !door.status);
                    }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};
