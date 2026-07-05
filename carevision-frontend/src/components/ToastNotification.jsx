import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import './ToastNotification.css';

/**
 * Global Toast Notification Component
 * Handles the display of real-time system alerts (success, error, emergency, info)
 * Refactored to improve accessibility semantics and rendering performance.
 */

// Centralized icon configuration map based on notification severity
const STATUS_ICONS = {
  success: <CheckCircle size={20} strokeWidth={2.5} />,
  error: <XCircle size={20} strokeWidth={2.5} />,
  emergency: <AlertTriangle size={20} strokeWidth={2.5} />,
  info: <Info size={20} strokeWidth={2.5} />,
};

const ToastNotification = ({ toasts, onDismiss }) => {
  // Early return if there are no active notifications to render
  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <div 
      className="global-toast-wrapper" 
      role="region" 
      aria-live="polite" 
      aria-label="System Notifications"
    >
      {toasts.map((toastItem) => {
        // Fallback to 'info' variant if an unknown type is passed
        const variantClass = `toast-variant-${toastItem.type || 'info'}`;
        const CurrentIcon = STATUS_ICONS[toastItem.type] || STATUS_ICONS.info;

        return (
          <div
            key={toastItem.id}
            className={`toast-item ${variantClass}`}
            role="alert"
          >
            <div className="status-icon" aria-hidden="true">
              {CurrentIcon}
            </div>
            
            <div className="toast-message">
              {toastItem.text}
            </div>
            
            <button
              className="btn-dismiss-toast"
              onClick={() => onDismiss(toastItem.id)}
              aria-label="Dismiss notification"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotification;