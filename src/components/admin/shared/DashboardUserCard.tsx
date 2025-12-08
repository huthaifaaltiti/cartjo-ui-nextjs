import { memo } from "react";

import { User } from "@/types/user";
import {
  DeleteUserResponse,
  SwitchUserActiveStatusResponse,
  UnDeleteUserResponse,
} from "@/types/totalUser";
import { Locale } from "@/types/locale";

import DashboardUserCardActions from "./DashboardUserCardActions";


export type UserCardProps = {
  user: User;
  deleteUser: (
    accessToken: string,
    userId: string
  ) => Promise<DeleteUserResponse>;
  unDeleteUser: (
    accessToken: string,
    userId: string
  ) => Promise<UnDeleteUserResponse>;
  accessToken: string;
  switchUserActiveStatus: (
    token: string,
    lang: Locale | string,
    isActive: boolean,
    userId: string
  ) => Promise<SwitchUserActiveStatusResponse>;
  queryKey: string;
};

const DashboardUserCard = ({
  user,
  deleteUser,
  unDeleteUser,
  accessToken,
  switchUserActiveStatus,
  queryKey,
}: UserCardProps) => {
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-md">
                {user.firstName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 capitalize">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs text-gray-600">@{user.username}</p>
            </div>
          </div>
          <span className="w-auto flex items-center gap-1">
            <span
              className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
                user.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>

            {user.isDeleted && (
              <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
                Deleted
              </span>
            )}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-600 truncate">📧 {user.email}</p>
          {user.role && <p className="text-sm text-gray-600">👤 {user.role}</p>}
        </div>

        <div className="mt-auto">
          <DashboardUserCardActions
            user={user}
            deleteUser={deleteUser}
            unDeleteUser={unDeleteUser}
            accessToken={accessToken}
            switchUserActiveStatus={switchUserActiveStatus}
            queryKey={queryKey}
          />
        </div>
      </div>
    </>
  );
};

export default memo(DashboardUserCard);
