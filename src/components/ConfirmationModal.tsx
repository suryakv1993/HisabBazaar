import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle } from 'lucide-react';

export const ConfirmationModal: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useApp();

  if (!confirmDialog || !confirmDialog.isOpen) return null;

  return (
    <div 
      id="confirmation-modal-backdrop"
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={closeConfirmDialog}
    >
      <div 
        id="confirmation-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {confirmDialog.title}
          </h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {confirmDialog.message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            id="modal-cancel-btn"
            onClick={closeConfirmDialog}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            id="modal-confirm-btn"
            onClick={confirmDialog.onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
          >
            {confirmDialog.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
