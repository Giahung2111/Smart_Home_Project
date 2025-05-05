const getAllMembersUrl = `${process.env.REACT_APP_API_BASE_URL}/users/`
const getAllDevicesInLivingRoomUrl = `${process.env.REACT_APP_API_BASE_URL}/rooms/living room/`
const updateDeviceUrl = `${process.env.REACT_APP_API_BASE_URL}/devices/update/`

export const DashboardAPI = {
    getAllMembersUrl : getAllMembersUrl,
    getAllDevicesInLivingRoomUrl : getAllDevicesInLivingRoomUrl,
    updateDeviceUrl : updateDeviceUrl
}