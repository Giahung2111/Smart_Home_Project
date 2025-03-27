import ApiService from "../ApiService";

const AUTH_API_URL = '/auth';

export const AuthAPI = {
    Login: async (username: string, password: string) => {
        return ApiService.post(`${AUTH_API_URL}/login`, { username, password });
    }
}

