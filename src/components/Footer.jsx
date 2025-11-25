import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer style={{
            backgroundColor: '#0B2E4F',
            color: '#FFFFFF',
            padding: '4rem 0 2rem 0',
            marginTop: '4rem',
            borderTop: '4px solid #FFD166'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <h3 style={{
                            marginBottom: '1rem',
                            color: '#FFD166',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>SmartBroker</h3>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: '1.6',
                            marginBottom: '1rem'
                        }}>
                            {t('footer.tagline')}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <a href="#" style={{
                                color: '#FFFFFF',
                                fontSize: '1.5rem',
                                transition: 'color 0.2s'
                            }}
                                onMouseEnter={(e) => e.target.style.color = '#FFD166'}
                                onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}>
                                📘
                            </a>
                            <a href="#" style={{
                                color: '#FFFFFF',
                                fontSize: '1.5rem',
                                transition: 'color 0.2s'
                            }}
                                onMouseEnter={(e) => e.target.style.color = '#FFD166'}
                                onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}>
                                🐦
                            </a>
                            <a href="#" style={{
                                color: '#FFFFFF',
                                fontSize: '1.5rem',
                                transition: 'color 0.2s'
                            }}
                                onMouseEnter={(e) => e.target.style.color = '#FFD166'}
                                onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}>
                                📷
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#FFFFFF'
                        }}>{t('footer.company')}</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[
                                { key: 'aboutUs', label: t('footer.aboutUs') },
                                { key: 'careers', label: t('footer.careers') },
                                { key: 'blog', label: t('footer.blog') },
                                { key: 'press', label: t('footer.press') }
                            ].map(item => (
                                <li key={item.key} style={{ marginBottom: '0.75rem' }}>
                                    <a href="#" style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.target.style.color = '#FFD166'}
                                        onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#FFFFFF'
                        }}>{t('footer.support')}</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[
                                { key: 'helpCenter', label: t('footer.helpCenter') },
                                { key: 'termsOfService', label: t('footer.termsOfService') },
                                { key: 'privacyPolicy', label: t('footer.privacyPolicy') },
                                { key: 'contactUs', label: t('footer.contactUs') }
                            ].map(item => (
                                <li key={item.key} style={{ marginBottom: '0.75rem' }}>
                                    <a href="#" style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.target.style.color = '#FFD166'}
                                        onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#FFFFFF'
                        }}>{t('footer.contact')}</h4>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: '0.5rem' }}>
                                📧 hello@smartbroker.com
                            </p>
                            <p style={{ marginBottom: '0.5rem' }}>
                                📞 +1 (555) 123-4567
                            </p>
                            <p style={{ marginBottom: '0.5rem' }}>
                                📍 123 Real Estate Ave, City
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem'
                }}>
                    <p>{t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
