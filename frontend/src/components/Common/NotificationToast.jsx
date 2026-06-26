import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCircle, AlertTriangle, X, Info, ShieldAlert } from 'lucide-react';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return { 
          bg: 'rgba(10, 110, 63, 0.95)', 
          border: '1px solid rgba(255,255,255,0.2)', 
          icon: CheckCircle, 
          color: '#FFFFFF' 
        };
      case 'error':
        return { 
          bg: 'rgba(194, 24, 91, 0.95)', 
          border: '1px solid rgba(255,255,255,0.2)', 
          icon: ShieldAlert, 
          color: '#FFFFFF' 
        };
      case 'warning':
        return { 
          bg: 'rgba(224, 162, 0, 0.95)', 
          border: '1px solid rgba(255,255,255,0.2)', 
          icon: AlertTriangle, 
          color: '#FFFFFF' 
        };
      default:
        return { 
          bg: 'rgba(18, 22, 26, 0.95)', 
          border: '1px solid rgba(255,255,255,0.2)', 
          icon: Info, 
          color: '#FFFFFF' 
        };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '24px',
      zIndex: 100000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {notifications.map((n) => {
        const styles = getStyles(n.type);
        const Icon = styles.icon;
        
        return (
          <div 
            key={n.id}
            className="animate-fade-in-up"
            style={{
              pointerEvents: 'auto',
              background: styles.bg,
              color: styles.color,
              border: styles.border,
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '280px',
              maxWidth: '360px',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', color: styles.color }}>
              <Icon size={18} />
            </div>
            <div style={{ fontSize: '11px', flex: 1, fontWeight: '500' }}>
              {n.message}
            </div>
            <button 
              onClick={() => removeNotification(n.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: styles.color,
                opacity: 0.7,
                padding: 0,
                display: 'flex'
              }}
              title="Close Notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;
