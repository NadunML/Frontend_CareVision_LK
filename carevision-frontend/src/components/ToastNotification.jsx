import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import './ToastNotification.css';

/**
 * ToastNotification
 *
 * Props:
 *  toasts  – array of { id, type, text }
 *            type: 'success' | 'error' | 'emergency' | 'info'
 *  onDismiss – fn(id) called when user closes a toast
 */
const ICON_MAP = {
  success:   <CheckCircle  size={18} />,
  error:     <XCircle      size={18} />,
  emergency: <AlertTriangle size={18} />,
  info:      <Info          size={18} />,
};

const ToastNotification = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          role="alert"
        >
          <span className="toast-icon">{ICON_MAP[toast.type] ?? ICON_MAP.info}</span>
          <span className="toast-text">{toast.text}</span>
          <button
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
