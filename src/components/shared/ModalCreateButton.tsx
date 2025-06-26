"use client";

import { memo, ReactNode, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";

type Props = {
  icon?: ReactNode;
  createTranslationKey?: string;
  ModalContent: ReactNode;
  buttonClassName?: string;
};

const ModalCreateButton = ({
  icon,
  createTranslationKey,
  ModalContent,
  buttonClassName = "w-auto min-h-3 bg-primary-500 hover:bg-primary-600 text-white-50 transition-all",
}: Props) => {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="w-full my-2 flex items-end justify-end">
        <Button className={buttonClassName} onClick={handleOpen}>
          {icon && <span className="mr-1">{icon}</span>}
          {createTranslationKey
            ? t(createTranslationKey)
            : t("general.actions.create")}
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose}>
        {ModalContent}
      </Modal>
    </>
  );
};

export default memo(ModalCreateButton);
