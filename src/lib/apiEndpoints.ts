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
      CREATE: `${BASE_URL}/api/v1/category/create`,
      EDIT: `${BASE_URL}/api/v1/category/update`,
    },
    SUB_CATEGORIES: {
      GET_ALL: `${BASE_URL}/api/v1/sub-category/all`,
      DELETE: `${BASE_URL}/api/v1/sub-category/delete`,
      UN_DELETE: `${BASE_URL}/api/v1/sub-category/un-delete`,
      SWITCH_ACTIVE_STATUS: `${BASE_URL}/api/v1/sub-category/status`,
      CREATE: `${BASE_URL}/api/v1/sub-category/create`,
      EDIT: `${BASE_URL}/api/v1/sub-category/update`,
    },
    PRODUCTS: {
      ALL: `${BASE_URL}/api/v1/product/all`,
      DELETE: `${BASE_URL}/api/v1/product/delete`,
      UN_DELETE: `${BASE_URL}/api/v1/product/un-delete`,
      SWITCH_ACTIVE_STATUS: `${BASE_URL}/api/v1/product/status`,
      CREATE: `${BASE_URL}/api/v1/product/create`,
      EDIT: `${BASE_URL}/api/v1/product/update`,
    },
    LOGOS: {
      ALL: `${BASE_URL}/api/v1/logo/all`,
      DELETE: `${BASE_URL}/api/v1/logo/delete`,
      UN_DELETE: `${BASE_URL}/api/v1/logo/un-delete`,
      SWITCH_ACTIVE_STATUS: `${BASE_URL}/api/v1/logo/status`,
      CREATE: `${BASE_URL}/api/v1/logo/create`,
      EDIT: `${BASE_URL}/api/v1/logo/update`,
    },
  },
};
