import { Avatar, Card, Switch } from "antd";
import {
  faLightbulb,
  faDoorClosed,
  faFan,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as regularLightbulb } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Row, Col } from "antd";

export const Dashboard = () => {
  const [lightOn, setLightOn] = useState(true);
  const [fanOn, setFanOn] = useState(true);
  const [doorOpen, setDoorOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Member Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Member</h2>
        <div className="bg-gray-100 p-4 rounded-xl flex gap-4">
          {[
            {
              name: "John Doe",
              role: "Admin",
              color: "#8B5CF6", // Purple
              initials: "JD",
            },
            {
              name: "Mike Lee",
              role: "User",
              color: "#FCA5A5", // Red
              initials: "ML",
            },
            {
              name: "Kim Lee",
              role: "User",
              color: "#86EFAC", // Green
              initials: "KL",
            },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <Avatar size="large" style={{ backgroundColor: member.color }}>
                {member.initials}
              </Avatar>
              <p className="font-semibold">{member.name}</p>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Devices Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Devices</h2>
        <div className="bg-gray-100 p-4 rounded-xl">
          <Row gutter={[16, 16]} justify="center">
            {/* Light Control */}
            <Col span={8}>
              <Card className="w-full text-center p-4 shadow-md">
                <Row gutter={[16, 16]} justify="center">
                  <Col span={8}>
                    <span className="text-2xl">
                      <FontAwesomeIcon icon={lightOn ? faLightbulb : regularLightbulb} />
                    </span>
                  </Col>
                  <Col span={8}>
                    <p className="font-semibold">{lightOn ? "ON" : "OFF"}</p>
                  </Col>
                  <Col span={8}>
                    <Switch checked={lightOn} onChange={() => setLightOn(!lightOn)} />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Fan Control */}
            <Col span={8}>
              <Card className="w-full text-center p-4 shadow-md">
                <Row gutter={[16, 16]} justify="center">
                  <Col span={8}>
                    <span className="text-2xl">
                      <FontAwesomeIcon icon={faFan} spin={fanOn} />
                    </span>
                  </Col>
                  <Col span={8}>
                    <p className="font-semibold">{fanOn ? "ON" : "OFF"}</p>
                  </Col>
                  <Col span={8}>
                    <Switch checked={fanOn} onChange={() => setFanOn(!fanOn)} />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Door Control */}
            <Col span={8}>
              <Card className="w-full text-center p-4 shadow-md">
                <Row gutter={[16, 16]} justify="center">
                  <Col span={8}>
                    <span className="text-2xl">
                      <FontAwesomeIcon icon={doorOpen ? faDoorOpen : faDoorClosed} />
                    </span>
                  </Col>
                  <Col span={8}>
                    <p className="font-semibold">{doorOpen ? "OPEN" : "CLOSE"}</p>
                  </Col>
                  <Col span={8}>
                    <Switch checked={doorOpen} onChange={() => setDoorOpen(!doorOpen)} />
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
