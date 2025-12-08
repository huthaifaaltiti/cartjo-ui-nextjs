"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldPlus } from "lucide-react";

import { useAdminUsers } from "@/contexts/AdminUsersContext";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CreateAdminUserForm from "./CreateAdminUserForm";

const CreateAdminUserBtn = () => {
  const t = useTranslations();
  const { accessToken } = useAdminUsers();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="w-full my-2 flex items-end justify-end">
        <Button
          className="w-auto min-h-3 bg-primary-500 hover:bg-primary-600 text-white-50 transition-all"
          onClick={handleOpen}
        >
          <ShieldPlus />
          {t(
            "routes.dashboard.routes.users.routes.adminUsers.components.CreateAdminUser.createAdmin"
          )}
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <CreateAdminUserForm accessToken={accessToken} />
      </Modal>
    </>
  );
};

export default memo(CreateAdminUserBtn);
