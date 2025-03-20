import ApiService from "../ApiService";

const MEMBER_API_URL = '/users/';

export const memberAPI = {
  // Hàm get all users vì backend không hỗ trợ query filter
  getAllUsers: async () => {
    return ApiService.get(MEMBER_API_URL);
  }
};
