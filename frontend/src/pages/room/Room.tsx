import { ConfigProvider, Form, Switch } from "antd"
import { CustomSidebar } from "../../components/customSidebar/customSidebar"
import { IRoomProps } from "./IRoom"
import './Room.css'
import { useEffect, useState } from "react"
import { CustomDrawer } from "../../components/customDrawer/customDrawer"
import { Field, FieldProps, Formik } from "formik"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDoorOpen, faFan, faLightbulb } from "@fortawesome/free-solid-svg-icons"
import { roomAPI } from "../../services/room/roomAPI"

export const Room = () => {
    const roomUrl = roomAPI.getAllRoomsUrl;
    const deviceUrl = roomAPI.getAllDevicesEachRoomUrl;
    const [rooms, setRooms] = useState([]);
    const [device, setDevice] = useState({
        id: 0,
        name: '',
        status: false
    })

    const getAllRooms = async () => {
        const response = await axios.get(roomUrl);

        const data = response.data.data;

        const roomData = data.map((room : any) => ({
            label: room.room_name,
            devices: room.devices.map((device : any) => ({
                id: device.id,
                name: device.device_name,
                icon: device.device_name === "fan" ? 
                <FontAwesomeIcon icon={faFan} /> : device.device_name === "door" ? 
                <FontAwesomeIcon icon={faDoorOpen} /> : <FontAwesomeIcon icon={faLightbulb} />,
                status: device.status
            }))
        }))

        setRooms(roomData);
    }

    useEffect(() => {
        getAllRooms();
    }, [])

    const switchTheme = {
        components: {
            Switch: {
                colorPrimary: '#7B5DF9',
                colorPrimaryHover: '#7B5DF9'
            }
        }
    }

    const [openDeviceManagement, setOpenDeviceManagement] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<IRoomProps[] | null>();

    const onDeviceManagementClose = () => {
        setOpenDeviceManagement(false)
    }

    const handleRoomClick = (room: IRoomProps) => {
        setSelectedRoom([room]);
    }

    const handleDeviceClick = (deviceId: number, name: string, deviceStatus: boolean) => {
        setDevice({
            id: deviceId,
            name: name,
            status: deviceStatus
        });
        setOpenDeviceManagement(true);
    }

    const handleUpdateDeviceStatus = async (id: number, status : boolean) => {
        const currentUser = JSON.parse(localStorage.getItem('user') as string);
        console.log("Current user: ", currentUser);
        const response = await axios.patch(`${roomAPI.updateDeviceUrl}${id}/`, {
          status : status,
          userID : currentUser.id,
        });
      }

    return (
        <div className="room-layout">
            <CustomSidebar
                sidebarItems={rooms}
                classname="room-sidebar"
                onItemClick={handleRoomClick}
            >
            </CustomSidebar>

            <div 
                className="room-content"
                style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
                <div 
                    className="room-device-container"
                    style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
                    <div className="room-content-header">
                        <h2>Devices</h2>
                    </div> 
                    {
                        selectedRoom?.map((item) => (
                        <>
                            <div className='room-device'>
                                {item.devices?.map((subItem: any) => (
                                    <div 
                                        className="device-item" 
                                        key={subItem.id}
                                        onClick={() => {
                                            handleDeviceClick(subItem.id, subItem.name, subItem.status);
                                        }}
                                    >
                                        {subItem.icon} <span>{subItem.name}</span>
                                    </div>
                                ))}
                            </div>
                            <CustomDrawer
                                open={openDeviceManagement}
                                onClose={onDeviceManagementClose}
                                title="Device Management"
                            >
                                <Formik
                                    initialValues={device}
                                    onSubmit={(values, {setSubmitting}) => {
                                        const newStatus = !device.status;
                                        
                                        setDevice({...device, status: newStatus});
                                        
                                        handleUpdateDeviceStatus(device.id, newStatus);
                                        
                                        setSubmitting(false);
                                    }}
                                >
                                    {({handleSubmit, isSubmitting}) => (
                                        <Form className='device-management-form'>
                                            <label htmlFor="device-connection" style={{fontWeight: "bold"}}>Turn on/off</label>
                                            <span>
                                                <ConfigProvider theme={switchTheme}>
                                                    <Field name='device-connection'>
                                                        {({ field }: FieldProps) => (
                                                            <Switch 
                                                                {...field}
                                                                checked={device.status}
                                                                onChange={() => handleSubmit()}
                                                                disabled={isSubmitting}
                                                            />
                                                        )}
                                                    </Field>
                                                </ConfigProvider>                                           
                                            </span>
                                        </Form>
                                    )}
                                </Formik>
                            </CustomDrawer>
                        </>
                        ))
                    }
                </div>               
            </div>
        </div>
    )
}