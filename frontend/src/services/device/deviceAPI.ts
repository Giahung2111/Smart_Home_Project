import ApiService from "../ApiService";

const DEVICE_API_URL = '/devices';

export const deviceAPI = {
    getAllDevice: async () => {
        return ApiService.get(`${DEVICE_API_URL}`);
    },

    updateDeviceStatus: async (deviceId: number, status: boolean) => {
        return ApiService.patch(`${DEVICE_API_URL}/${deviceId}/`, {status});
    },
}

