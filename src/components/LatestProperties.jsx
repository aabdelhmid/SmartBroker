import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import PropertyCard from './PropertyCard';

const LatestProperties = () => {
    const { properties } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);

    // Get latest 5 approved properties sorted by creation date
    const latestProperties = properties
        .filter(p => p.status === 'approved')
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    const totalCards = latestProperties.length;
    const cardsToShow = 3; // Show 3 cards on desktop
    const maxIndex = Math.max(0, totalCards - cardsToShow);

    // Navigate to next card (scroll by 1)
    const handleNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // Navigate to previous card (scroll by 1)
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (totalCards === 0) return null;

    return (
        <section style={{
            padding: '4rem 0',
            backgroundColor: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
            <div className="container">
                {/* Section Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexDirection: isArabic ? 'row-reverse' : 'row'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        margin: 0
                    }}>
                        {isArabic ? 'أحدث العقارات' : 'Latest Properties'}
                    </h2>
                    <Link
                        to="/properties"
                        style={{
                            color: 'var(--primary)',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    >
                        {isArabic ? 'عرض الكل ←' : 'View All →'}
                    </Link>
                </div>

                {/* Slider Container */}
                <div style={{ position: 'relative' }}>
                    {/* Slider Wrapper */}
                    <div
                        ref={sliderRef}
                        style={{
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        <div
                            className="latest-properties-slider"
                            style={{
                                display: 'flex',
                                gap: '1.5rem',
                                transform: `translateX(${isArabic ? currentIndex * (100 / cardsToShow + 1.5) : -currentIndex * (100 / cardsToShow + 1.5)}%)`,
                                transition: 'transform 0.5s ease',
                                direction: isArabic ? 'rtl' : 'ltr'
                            }}
                        >
                            {latestProperties.map((property) => (
                                <div
                                    key={property.id}
                                    style={{
                                        flex: '0 0 calc(33.333% - 1rem)',
                                        minWidth: 'calc(33.333% - 1rem)'
                                    }}
                                    className="slider-card"
                                >
                                    <PropertyCard property={property} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {totalCards > cardsToShow && (
                        <>
                            {/* Previous Button */}
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                aria-label={isArabic ? 'السابق' : 'Previous'}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: isArabic ? 'auto' : '-20px',
                                    right: isArabic ? '-20px' : 'auto',
                                    transform: 'translateY(-50%)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    border: '2px solid var(--border)',
                                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--primary)',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'all 0.3s ease',
                                    zIndex: 10,
                                    opacity: currentIndex === 0 ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (currentIndex > 0) {
                                        e.currentTarget.style.backgroundColor = 'var(--primary)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentIndex > 0) {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.color = 'var(--primary)';
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                    }
                                }}
                            >
                                {isArabic ? '›' : '‹'}
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={handleNext}
                                disabled={currentIndex >= maxIndex}
                                aria-label={isArabic ? 'التالي' : 'Next'}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: isArabic ? 'auto' : '-20px',
                                    left: isArabic ? '-20px' : 'auto',
                                    transform: 'translateY(-50%)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    border: '2px solid var(--border)',
                                    cursor: currentIndex >= maxIndex ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    color: currentIndex >= maxIndex ? 'var(--text-muted)' : 'var(--primary)',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'all 0.3s ease',
                                    zIndex: 10,
                                    opacity: currentIndex >= maxIndex ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (currentIndex < maxIndex) {
                                        e.currentTarget.style.backgroundColor = 'var(--primary)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentIndex < maxIndex) {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.color = 'var(--primary)';
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                    }
                                }}
                            >
                                {isArabic ? '‹' : '›'}
                            </button>
                        </>
                    )}
                </div>

                {/* Progress Indicator */}
                {totalCards > cardsToShow && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '2rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ fontWeight: '500' }}>
                            {currentIndex + 1} - {Math.min(currentIndex + cardsToShow, totalCards)}
                        </span>
                        <span>/</span>
                        <span>{totalCards}</span>
                    </div>
                )}
            </div>

            {/* Mobile Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    .latest-properties-slider {
                        gap: 1rem !important;
                    }
                    
                    .slider-card {
                        flex: 0 0 100% !important;
                        min-width: 100% !important;
                    }
                    
                    .latest-properties-slider {
                        transform: translateX(${isArabic ? '' : '-'}${currentIndex * 100}%) !important;
                    }
                }
                
                /* Smooth scrolling for touch devices */
                @media (hover: none) and (pointer: coarse) {
                    .latest-properties-slider {
                        scroll-snap-type: x mandatory;
                        -webkit-overflow-scrolling: touch;
                    }
                    
                    .slider-card {
                        scroll-snap-align: start;
                    }
                }
            `}</style>
        </section>
    );
};

export default LatestProperties;
