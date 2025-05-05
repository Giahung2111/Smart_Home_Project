import { Button, ConfigProvider, Form, Input, Image, Switch, Select } from "antd"
import { CustomSidebar } from "../../components/customSidebar/customSidebar"
import { IRoomProps } from "./IRoom"
import { BulbFilled, EditOutlined, PlusOutlined } from "@ant-design/icons"
import './Room.css'
import { useEffect, useState } from "react"
import { CustomDrawer } from "../../components/customDrawer/customDrawer"
import { Field, FieldProps, Formik } from "formik"
import { RoomDeviceOptionsConstant } from "../../constants/RoomPageConstants"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDoorOpen, faFan, faLightbulb } from "@fortawesome/free-solid-svg-icons"

export const Room = () => {
    const roomUrl = 'http://127.0.0.1:8000/api/rooms';
    const deviceUrl = 'http://127.0.0.1:8000/api/devices';
    const [rooms, setRooms] = useState([]);
    const [device, setDevice] = useState({
        id: 0,
        name: '',
        status: false
    })

    const getAllRooms = async () => {
        const response = await axios.get(roomUrl);
        // console.log(response.data);

        const data = response.data.data;
        console.log(data)
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

    const configCreateRoomButton = {
        components: {
            Button: {
                colorText: '#7B5DF9',
            }
        }
    }

    const configAddDeviceButton = {
        components: {
            Button: {
                colorPrimary: '#7B5DF9',
                colorPrimaryHover: '#7B5DF9',
                colorPrimaryActive: '#c4b5fe'
            }
        }
    }

    const configAddRoomButton = {
        components: {
            Button: {
                colorPrimary: '#7B5DF9',
                colorPrimaryHover: '#7B5DF9',
                colorPrimaryActive: '#c4b5fe'
            }
        }
    }

    const switchTheme = {
        components: {
            Switch: {
                colorPrimary: '#7B5DF9',
                colorPrimaryHover: '#7B5DF9'
            }
        }
    }

    const [openAddDevice, setOpenAddDevice] = useState(false);
    const [openDeviceManagement, setOpenDeviceManagement] = useState(false);
    const [openAddRoom, setOpenAddRoom] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<IRoomProps[] | null>();

    const showAddDeviceDrawer = () => {
        setOpenAddDevice(true)
    }

    const onAddDeviceClose = () => {
        setOpenAddDevice(false)
    }

    const showAddRoomDrawer = () => {
        setOpenAddRoom(true)
    }

    const onAddRoomClose = () => {
        setOpenAddRoom(false)
    }

    const showDeviceManagementDrawer = () => {
        setOpenDeviceManagement(true)
    }

    const onDeviceManagementClose = () => {
        setOpenDeviceManagement(false)
    }

    const deviceInitialValues = {}
    const roomInitialValues = {}
    const deviceManagementInitialValues = {}

    const onSubmit = () => {}

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

    const handleUpdateDeviceStatus = async (id: number, status: boolean) => {
        try {
            const response = await axios.patch(`${deviceUrl}/update/${id}/`, {
                status: status
            });
            
            console.log(response.data);
            
            getAllRooms();
        } catch (error) {
            console.error("Error updating device status:", error);
        }
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
                                    onSubmit={(values, {setSubmitting, resetForm}) => {
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