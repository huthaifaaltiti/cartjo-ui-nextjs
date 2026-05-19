import { AUTH_STORAGE_CONST } from "@/constants/authStorage.constant";

type StorageValue = string | number | boolean | object | null;

export const authStorage = {
  set: (key: string, value: StorageValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },

  get: <T>(key: string): T | null => {
    try {
      const raw = localStorage.getItem(key);

      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },

  clear: () => {
    try {
      Object.values(AUTH_STORAGE_CONST).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch {}
  },
};
