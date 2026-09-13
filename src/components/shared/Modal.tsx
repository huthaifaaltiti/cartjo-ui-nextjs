"use client";

import { ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] px-4 sm:px-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white-50 rounded-2xl p-6 w-full max-w-4xl max-h-[calc(100vh-100px)] relative shadow-2xl flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-700 transition-all p-1.5 rounded-xl hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✖
        </button>

        {/* Content (scrollable if too tall) */}
        <div className="mt-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
