import { Button, ConfigProvider, Form, Input, Image, Switch, Select } from "antd"
import { CustomSidebar } from "../../components/customSidebar/customSidebar"
import { IRoomProps } from "./IRoom"
import { BulbFilled, EditOutlined, PlusOutlined } from "@ant-design/icons"
import './Room.css'
import { useState } from "react"
import { CustomDrawer } from "../../components/customDrawer/customDrawer"
import { Field, FieldProps, Formik } from "formik"
import { RoomDeviceOptionsConstant } from "../../constants/RoomPageConstants"

export const Room = () => {
    const rooms : IRoomProps[] = [
        {
            label: "Living Room",
            devices: [
                {
                    name: "Light",
                    icon: <BulbFilled />,
                    isConnected: true
                },
                {
                    name: "Light",
                    icon: <BulbFilled />,
                    isConnected: true
                }
            ]
        },
        {
            label: "Bedroom",
            devices: [{
                name: "Light",
                icon: <BulbFilled />,
                isConnected: true
            }]
        }
    ]

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

    return (
        <div className="room-layout">
            <CustomSidebar
                sidebarItems={rooms}
                classname="room-sidebar"
                onItemClick={handleRoomClick}
            >
                <ConfigProvider theme={configCreateRoomButton}>
                    <Button 
                        type='text' 
                        icon={<PlusOutlined />}
                        className="add-room-button"
                        onClick={showAddRoomDrawer}
                        style={{color: 'var(--text-color)'}}
                    >
                        Create Room
                    </Button>
                </ConfigProvider>

                <CustomDrawer
                    open={openAddRoom}
                    onClose={onAddRoomClose}
                    title="Add new Room"
                >
                    <Formik
                        initialValues={roomInitialValues}
                        onSubmit={onSubmit}
                    >
                        <Form className='add-room-form'>
                            <div style={{width: '100%'}}>
                                <label htmlFor="room-name" style={{fontWeight: "bold"}}>Room Name</label>
                                <Input type="text" placeholder="Enter room name" />
                            </div>

                            <ConfigProvider theme={configAddRoomButton}>
                                <Button type="primary" style={{width: '100%'}}>Submit</Button>
                            </ConfigProvider>
                        </Form>
                    </Formik>
                </CustomDrawer>
            </CustomSidebar>

            <div 
                className="room-content"
                style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
                <div 
                    className="room-device-container"
                    style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
                    <div className="room-content-header">
                        <h2>Devices</h2>
                        <ConfigProvider theme={configAddDeviceButton}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={showAddDeviceDrawer}>Add device</Button>
                        </ConfigProvider>

                        <CustomDrawer
                            open={openAddDevice}
                            onClose={onAddDeviceClose}
                            title="Add new Device"
                        >
                            <Formik
                                initialValues={deviceInitialValues}
                                onSubmit={onSubmit}
                            >
                                <Form className='add-new-device-form'>
                                    <div>
                                        <label htmlFor="device-name">Choose device</label>
                                        <Field name='device-name'>
                                            {({ field, form } : FieldProps) => (
                                                <Select 
                                                    {...field}
                                                    id='device-name'
                                                    placeholder='Choose a device'
                                                    options={RoomDeviceOptionsConstant}
                                                    onChange={(value) => form.setFieldValue('name', value)}
                                                    style={{width: '100%'}}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    
                                    <ConfigProvider theme={configAddDeviceButton}>
                                        <Button type="primary" style={{width: '100%'}}>Submit</Button>
                                    </ConfigProvider>
                                    
                                </Form>
                            </Formik>
                        </CustomDrawer>
                    </div> 
                    {
                        selectedRoom?.map((item) => (
                        <>
                            <div className='room-device' onClick={showDeviceManagementDrawer}>
                                {item.devices?.map((subItem) => (
                                    <div className="device-item">
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
                                    initialValues={deviceManagementInitialValues}
                                    onSubmit={onSubmit}
                                >
                                    <Form className='device-management-form'>
                                        <label htmlFor="device-connection" style={{fontWeight: "bold"}}>Connection</label>
                                        <span>
                                            <ConfigProvider theme={switchTheme}>
                                                <Field name='device-connection'>
                                                    {({ field } : FieldProps) => (
                                                        <Switch 
                                                            checked={field.value}
                                                        />
                                                    )}
                                                </Field>
                                            </ConfigProvider>                                           
                                        </span>
                                    </Form>
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