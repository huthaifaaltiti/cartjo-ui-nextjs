import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal Box */}
      <div className="bg-white-50 rounded-xl p-6 w-full max-w-lg max-h-[calc(100vh-100px)] relative shadow-lg flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-3 ltr:right-4 rtl:left-4 text-gray-700 hover:text-black-300 transition-all"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Content (scrollable if too tall) */}
        <div className="mt-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
