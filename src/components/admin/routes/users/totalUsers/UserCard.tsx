"use client";

import { memo } from "react";
import { User } from "@/types/user";

type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => {
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* User Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {user.firstName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              user.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600 truncate">📧 {user.email}</p>
          {user.role && <p className="text-sm text-gray-600">👤 {user.role}</p>}
        </div>

        {/* Actions */}
        {/* <UserActions user={user} onEdit={() => setIsEditModalOpen(true)} /> */}
      </div>

      {/* Edit Modal */}
      {/* {isEditModalOpen && (
        <UserEditModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )} */}
    </>
  );
};

export default memo(UserCard);
