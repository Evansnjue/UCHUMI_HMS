/**
 * Common UI Components
 * Reusable, accessible, and composable components
 */

import React from 'react';

// ============================================================================
// LOADING STATES
// ============================================================================

export const Skeleton: React.FC<{ className?: string; count?: number }> = ({
  className = 'h-8 w-full',
  count = 1,
}) => {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`${className} animate-pulse bg-gray-200 rounded`}
          aria-busy="true"
          aria-label="Loading..."
        />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(columns)].map((_, j) => (
            <Skeleton key={j} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SpinnerLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size];

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClass} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
        role="status"
        aria-label="Loading..."
      />
    </div>
  );
};

// ============================================================================
// EMPTY STATES
// ============================================================================

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && <div className="mb-4 text-4xl text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 mb-4 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

// ============================================================================
// BUTTONS & ACTIONS
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantClass = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50',
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  return (
    <button
      className={`flex items-center gap-2 font-medium rounded-lg transition ${variantClass} ${sizeClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <SpinnerLoader size="sm" />}
      {icon && !isLoading && <span>{icon}</span>}
      {children}
    </button>
  );
};

// ============================================================================
// ALERTS & MESSAGES
// ============================================================================

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onDismiss,
  className = '',
}) => {
  const typeClass = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[type];

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 ${typeClass} ${className}`}
      role="alert"
    >
      <span className="text-lg font-bold flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        {message && <p className="text-sm mt-1">{message}</p>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-lg font-bold hover:opacity-70"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
};

// ============================================================================
// DIALOGS & MODALS
// ============================================================================

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[size];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 ${sizeClass}`}
        role="dialog"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-96 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && <div className="border-t p-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </>
  );
};

// ============================================================================
// CONFIRMATION DIALOGS
// ============================================================================

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-700">{message}</p>
    </Dialog>
  );
};

// ============================================================================
// BADGES & STATUS INDICATORS
// ============================================================================

interface BadgeProps {
  label: string;
  color: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, className = '' }) => {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${color} ${className}`}
    >
      {label}
    </span>
  );
};

interface StatusIndicatorProps {
  status: string;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className = '',
}) => {
  const statusColors: Record<string, string> = {
    active: 'bg-green-400',
    inactive: 'bg-gray-400',
    pending: 'bg-yellow-400',
    error: 'bg-red-400',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`h-2 w-2 rounded-full ${statusColors[status.toLowerCase()] || 'bg-gray-400'}`}
        aria-hidden="true"
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </div>
  );
};

// ============================================================================
// DIVIDER
// ============================================================================

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`border-t border-gray-200 ${className}`} />;
};

// ============================================================================
// FORM HELPERS
// ============================================================================

interface FormGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  required = false,
  error,
  children,
  hint,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ error = false, className = '', ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      {...props}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  error = false,
  options,
  className = '',
  ...props
}) => {
  return (
    <select
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      {...props}
    >
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  error = false,
  className = '',
  ...props
}) => {
  return (
    <textarea
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      {...props}
    />
  );
};
