import axiosInstance from "./AxiosConfig";

const ApiService = {
  get: async (url: string, params = {}) => {
    try {
      const response = await axiosInstance.get(url, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  post: async <T>(url: string, data: T) => {
    try {
      const response = await axiosInstance.post<T>(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  put: async <T>(url: string, data: T) => {
    try {
      const response = await axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await axiosInstance.delete(url);
      return response.data as unknown;
    } catch (error) {
      throw error;
    }
  },
};

export default ApiService;