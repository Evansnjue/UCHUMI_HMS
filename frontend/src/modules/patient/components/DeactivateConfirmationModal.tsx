/**
 * Deactivate Confirmation Modal Component
 * Confirm patient deactivation with reason
 */

import React, { useState } from 'react';

interface DeactivateConfirmationModalProps {
  patientName: string;
  isOpen: boolean;
  isSubmitting?: boolean;
  error?: string;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
}

export const DeactivateConfirmationModal: React.FC<DeactivateConfirmationModalProps> = ({
  patientName,
  isOpen,
  isSubmitting = false,
  error,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!reason.trim()) {
      setLocalError('Please provide a reason for deactivation');
      return;
    }

    try {
      await onConfirm(reason);
      setReason('');
    } catch (err) {
      setLocalError((err as any).message || 'Failed to deactivate patient');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <h2 className="text-xl font-bold text-gray-900">Deactivate Patient</h2>
          <p className="text-gray-600 mt-2">
            Are you sure you want to deactivate <strong>{patientName}</strong>?
          </p>

          {/* Warning */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Deactivated patients can still be viewed but cannot be edited
              or assigned to visits.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            {/* Reason Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Deactivation *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                placeholder="E.g., Patient moved, switched healthcare provider, etc."
                rows={3}
              />
              {(localError || error) && (
                <p className="text-sm text-red-600 mt-2">{localError || error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-red-300"
              >
                {isSubmitting ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
