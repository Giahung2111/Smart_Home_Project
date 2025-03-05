import ApiService from "../ApiService";

const AUTH_API_URL = '/auth';

export const AuthAPI = {
    Login: async (email: string, password: string) => {
        return ApiService.post(`${AUTH_API_URL}/login`, { email, password });
    }
}