const getAllRoomsUrl = `${process.env.REACT_APP_API_BASE_URL}/rooms/`;
const getALlDevicesEachRoomUrl = `${process.env.REACT_APP_API_BASE_URL}/devices/`;
const updateDeviceUrl = `${process.env.REACT_APP_API_BASE_URL}/devices/update/`

export const roomAPI = {
    getAllRoomsUrl : getAllRoomsUrl,
    getAllDevicesEachRoomUrl : getALlDevicesEachRoomUrl,
    updateDeviceUrl : updateDeviceUrl
}