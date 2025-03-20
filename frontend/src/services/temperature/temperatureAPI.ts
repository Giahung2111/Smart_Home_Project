import ApiService from "../ApiService";

const TEMPERATURE_API_URL = '/devices/temperature/';

export const temperatureAPI = {
    getTemperature: () => ApiService.get("/devices/temperature/"),
};
  