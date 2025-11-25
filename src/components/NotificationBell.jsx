import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NotificationBell = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: 'New property listing in Maadi',
            messageAr: 'عقار جديد في المعادي',
            time: '5 min ago',
            timeAr: 'منذ 5 دقائق',
            read: false
        },
        {
            id: 2,
            message: 'Your property was approved',
            messageAr: 'تم الموافقة على عقارك',
            time: '1 hour ago',
            timeAr: 'منذ ساعة',
            read: false
        },
        {
            id: 3,
            message: 'New interest in your property',
            messageAr: 'اهتمام جديد بعقارك',
            time: '2 hours ago',
            timeAr: 'منذ ساعتين',
            read: true
        }
    ]);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('notifications.title') || 'Notifications'}
                aria-expanded={isOpen}
                aria-haspopup="true"
                style={{
                    position: 'relative',
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s',
                    minWidth: '44px',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                {/* Bell Icon */}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'inherit' }}
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: '#EF4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #0B2E4F'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    role="menu"
                    aria-label={t('notifications.menu') || 'Notifications menu'}
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: isArabic ? 'auto' : 0,
                        left: isArabic ? 0 : 'auto',
                        backgroundColor: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        minWidth: '320px',
                        maxWidth: '400px',
                        maxHeight: '400px',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.2s',
                        zIndex: 1000
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
                            {isArabic ? 'الإشعارات' : 'Notifications'}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--primary)',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {isArabic ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    role="menuitem"
                                    onClick={() => markAsRead(notification.id)}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        backgroundColor: notification.read ? 'white' : '#F0F5FA',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.read ? 'white' : '#F0F5FA'}
                                >
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                                        {!notification.read && (
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: 'var(--primary)',
                                                marginTop: '0.5rem',
                                                flexShrink: 0
                                            }} />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.9rem',
                                                color: 'var(--text-primary)',
                                                fontWeight: notification.read ? 'normal' : '500'
                                            }}>
                                                {isArabic ? notification.messageAr : notification.message}
                                            </p>
                                            <p style={{
                                                margin: '0.25rem 0 0 0',
                                                fontSize: '0.8rem',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {isArabic ? notification.timeAr : notification.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                padding: '2rem',
                                textAlign: 'center',
                                color: 'var(--text-muted)'
                            }}>
                                <p>{isArabic ? 'لا توجد إشعارات' : 'No notifications'}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
