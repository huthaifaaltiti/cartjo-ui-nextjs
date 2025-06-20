const BASE_URL = process.env.NEXT_PUBLIC_API_LINK;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/v1/authentication/register`,
    LOGIN: `${BASE_URL}/api/v1/authorization/login`,
  },
  DASHBOARD: {
    LOCATIONS: {
      BULK_UPLOAD_LOCATIONS: `${BASE_URL}/api/v1/location/bulk-upload`,
      GET_LOCATIONS: `${BASE_URL}/api/v1/location/all`,
    },
    USERS: {
      GET_USERS: `${BASE_URL}/api/v1/user/all`,
      GET_USERS_STATS: `${BASE_URL}/api/v1/user/stats`,
      GET_TOTAL_USERS: `${BASE_URL}/api/v1/user/all`,
      DELETE_USER: `${BASE_URL}/api/v1/user/delete`,
      UNDELETE_USER: `${BASE_URL}/api/v1/user/un-delete`,
      SWITCH_USER_ACTIVE_STATUS: `${BASE_URL}/api/v1/user/status`,
      GET_ACTIVE_USERS: `${BASE_URL}/api/v1/user/all`,
      GET_DELETED_USERS: `${BASE_URL}/api/v1/user/all`,
      GET_ADMIN_USERS: `${BASE_URL}/api/v1/user/all`,
      CREATE_ADMIN: `${BASE_URL}/api/v1/user/create-admin`,
      UPDATE_ADMIN: `${BASE_URL}/api/v1/user/update-admin`,
    },
    CATEGORIES: {
      GET_ALL: `${BASE_URL}/api/v1/category/all`,
      DELETE: `${BASE_URL}/api/v1/category/delete`,
      UN_DELETE: `${BASE_URL}/api/v1/category/un-delete`,
      SWITCH_ACTIVE_STATUS: `${BASE_URL}/api/v1/category/status`,
    },
  },
};
