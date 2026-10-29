'use client';

import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#2C302E]/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-8 shadow-xl space-y-4">
        <h3 className="font-serif text-2xl text-[#2C302E]">{title}</h3>
        <p className="text-sm font-medium text-[#2C302E]/70">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/15 text-[#2C302E] hover:bg-[#EFEBE4] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold bg-[#B85D43] text-white hover:bg-[#9c4d37] transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
