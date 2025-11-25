import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const dropdownRef = useRef(null);

  // Detect scroll position with hide/show behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state when scroll > 10px
      setIsScrolled(currentScrollY > 10);

      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Update document direction for RTL
  useEffect(() => {
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
  }, [isArabic]);

  const navLinks = [
    { to: '/buy', label: t('navbar.buy') },
    { to: '/rent', label: t('navbar.rent') },
    { to: '/sell', label: t('navbar.sell') },
    { to: '/agents', label: t('navbar.agents') }
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        backgroundColor: isScrolled ? '#0B2E4F' : 'rgba(255, 255, 255, 0.95)',
        borderBottom: isScrolled ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
        padding: '0.75rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease, transform 0.3s ease',
        backdropFilter: isScrolled ? 'none' : 'blur(10px)',
        transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)'
      }}
    >
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        flexDirection: isArabic ? 'row-reverse' : 'row'
      }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: isScrolled ? '#FFD166' : 'var(--primary)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s ease'
          }}
          aria-label="SmartBroker Home"
        >
          SmartBroker
        </Link>

        {/* Center: Desktop Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flex: 1,
            justifyContent: 'center',
            flexDirection: isArabic ? 'row-reverse' : 'row'
          }}
          className="desktop-nav"
          role="menubar"
        >
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              role="menuitem"
              style={{
                color: isScrolled ? '#FFFFFF' : (location.pathname === link.to ? 'var(--primary)' : 'var(--text-main)'),
                fontWeight: location.pathname === link.to ? 600 : 500,
                textDecoration: 'none',
                padding: '0.5rem 0',
                borderBottom: location.pathname === link.to ? `2px solid ${isScrolled ? '#FFD166' : 'var(--primary)'}` : '2px solid transparent',
                transition: 'all 0.3s ease',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.target.style.color = isScrolled ? '#FFD166' : 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = isScrolled ? '#FFFFFF' : (location.pathname === link.to ? 'var(--primary)' : 'var(--text-main)')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexDirection: isArabic ? 'row-reverse' : 'row'
        }}>
          {/* Language Switcher */}
          <div className="desktop-only" style={{ display: 'flex', color: isScrolled ? '#FFFFFF' : 'inherit' }}>
            <LanguageSwitcher />
          </div>

          {/* Notifications */}
          {user && (
            <div className="desktop-only" style={{ display: 'flex', color: isScrolled ? '#FFFFFF' : 'var(--text-main)' }}>
              <NotificationBell />
            </div>
          )}

          {/* User Menu (Desktop) */}
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }} className="desktop-only">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                aria-label="User menu"
                aria-expanded={isUserDropdownOpen}
                aria-haspopup="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.15)' : 'white',
                  border: isScrolled ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isScrolled ? 'rgba(255, 255, 255, 0.25)' : '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isScrolled ? 'rgba(255, 255, 255, 0.15)' : 'white';
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FFD166',
                  color: '#0B2E4F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}>
                  {getUserInitials()}
                </div>
                <span style={{
                  color: isScrolled ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.875rem',
                  transition: 'color 0.3s ease',
                  direction: isArabic ? 'rtl' : 'ltr'
                }}>
                  {t('navbar.hello')}, {user.name || 'User'}
                </span>
                <span style={{ fontSize: '0.75rem', color: isScrolled ? '#FFFFFF' : 'var(--text-muted)', transition: 'color 0.3s ease' }}>
                  {isUserDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div
                  role="menu"
                  aria-label="User menu options"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: isArabic ? 'auto' : 0,
                    left: isArabic ? 0 : 'auto',
                    backgroundColor: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    minWidth: '180px',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.2s'
                  }}
                >
                  <Link
                    to="/dashboard"
                    role="menuitem"
                    onClick={() => setIsUserDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    {t('navbar.dashboard')}
                  </Link>
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setIsUserDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      borderTop: '1px solid var(--border)',
                      transition: 'background-color 0.2s',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    {t('navbar.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    role="menuitem"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      color: '#EF4444',
                      textAlign: isArabic ? 'right' : 'left',
                      backgroundColor: 'white',
                      border: 'none',
                      borderTop: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    {t('navbar.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: isArabic ? 'row-reverse' : 'row' }} className="desktop-only">
              <Link to="/login"><button className="btn btn-outline">{t('navbar.login')}</button></Link>
              <Link to="/signup"><button className="btn btn-primary">{t('navbar.signup')}</button></Link>
            </div>
          )}

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-only"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '4px',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              minWidth: '44px',
              minHeight: '44px',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <span style={{
              width: '24px',
              height: '2px',
              backgroundColor: isScrolled ? '#FFFFFF' : 'var(--text-main)',
              transition: 'all 0.3s',
              transform: isMobileMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none'
            }}></span>
            <span style={{
              width: '24px',
              height: '2px',
              backgroundColor: isScrolled ? '#FFFFFF' : 'var(--text-main)',
              transition: 'all 0.3s',
              opacity: isMobileMenuOpen ? 0 : 1
            }}></span>
            <span style={{
              width: '24px',
              height: '2px',
              backgroundColor: isScrolled ? '#FFFFFF' : 'var(--text-main)',
              transition: 'all 0.3s',
              transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none'
            }}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu"
          role="dialog"
          aria-label="Mobile navigation menu"
          style={{
            display: 'none',
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.3s'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              maxHeight: '80vh',
              overflowY: 'auto',
              animation: 'slideDown 0.3s',
              direction: isArabic ? 'rtl' : 'ltr'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '0.75rem',
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: location.pathname === link.to ? 600 : 400,
                    backgroundColor: location.pathname === link.to ? '#f8f9fa' : 'transparent',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border)' }}></div>

              <LanguageSwitcher />

              {user ? (
                <>
                  <div style={{ margin: '0.5rem 0', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {t('navbar.hello')}, {user.name || 'User'}
                  </div>
                  <Link to="/dashboard" style={{ padding: '0.75rem', color: 'var(--text-main)', textDecoration: 'none', borderRadius: 'var(--radius-sm)', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                    {t('navbar.dashboard')}
                  </Link>
                  <Link to="/profile" style={{ padding: '0.75rem', color: 'var(--text-main)', textDecoration: 'none', borderRadius: 'var(--radius-sm)', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                    {t('navbar.profile')}
                  </Link>
                  <button onClick={handleLogout} style={{ padding: '0.75rem', color: '#EF4444', textAlign: isArabic ? 'right' : 'left', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', minHeight: '44px' }}>
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"><button className="btn btn-outline" style={{ width: '100%', minHeight: '44px' }}>{t('navbar.login')}</button></Link>
                  <Link to="/signup"><button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', minHeight: '44px' }}>{t('navbar.signup')}</button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          .mobile-menu { display: block !important; }
        }

        /* Focus states for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #FFD166;
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
