import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';

const SpecialOffers = () => {
    const { properties } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoPlayRef = useRef(null);

    // Filter properties with discounts
    const specialOfferProperties = properties.filter(p =>
        p.status === 'approved' &&
        (p.discount_percentage > 0 || p.offerPercentage > 0)
    );

    const totalSlides = specialOfferProperties.length;

    // Auto-play functionality
    useEffect(() => {
        if (totalSlides === 0 || isPaused) return;

        autoPlayRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 4000); // 4 seconds

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [totalSlides, isPaused]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    if (totalSlides === 0) return null;

    return (
        <section style={{
            padding: '4rem 0',
            background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF5EB 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container">
                {/* Section Title */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary)'
                    }}>
                        {isArabic ? 'عروض خاصة' : 'Special Offers'}
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.1rem'
                    }}>
                        {isArabic
                            ? 'اغتنم الفرصة واحصل على أفضل العروض'
                            : 'Don\'t miss out on our best deals'}
                    </p>
                </div>

                {/* Slider Container */}
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        position: 'relative',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}
                >
                    {/* Slides */}
                    <div style={{
                        position: 'relative',
                        height: '450px',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden'
                    }}>
                        {specialOfferProperties.map((property, index) => {
                            const discount = property.discount_percentage || property.offerPercentage || 0;
                            const originalPrice = property.price;
                            const discountedPrice = originalPrice * (1 - discount / 100);

                            return (
                                <div
                                    key={property.id}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: currentSlide === index ? 1 : 0,
                                        transform: currentSlide === index ? 'scale(1)' : 'scale(0.95)',
                                        transition: 'opacity 0.6s ease, transform 0.6s ease',
                                        pointerEvents: currentSlide === index ? 'auto' : 'none'
                                    }}
                                >
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: isArabic ? '1fr 1fr' : '1fr 1fr',
                                        height: '100%',
                                        backgroundColor: 'white',
                                        borderRadius: 'var(--radius-lg)',
                                        boxShadow: 'var(--shadow-lg)',
                                        overflow: 'hidden',
                                        direction: isArabic ? 'rtl' : 'ltr'
                                    }}
                                        className="offer-slide"
                                    >
                                        {/* Image Side */}
                                        <div style={{
                                            position: 'relative',
                                            overflow: 'hidden',
                                            order: isArabic ? 2 : 1
                                        }}>
                                            <img
                                                src={property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                                                alt={property.address}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />

                                            {/* Discount Badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '1.5rem',
                                                right: isArabic ? 'auto' : '1.5rem',
                                                left: isArabic ? '1.5rem' : 'auto',
                                                backgroundColor: '#EF4444',
                                                color: 'white',
                                                padding: '0.75rem 1.25rem',
                                                borderRadius: 'var(--radius-md)',
                                                fontWeight: 'bold',
                                                fontSize: '1.25rem',
                                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                                                transform: 'rotate(-5deg)',
                                                zIndex: 10
                                            }}>
                                                {isArabic ? `خصم ${discount}%` : `${discount}% OFF`}
                                            </div>
                                        </div>

                                        {/* Details Side */}
                                        <div style={{
                                            padding: '3rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            gap: '1.5rem',
                                            order: isArabic ? 1 : 2
                                        }}>
                                            {/* Property Type Badge */}
                                            <div style={{
                                                display: 'inline-block',
                                                width: 'fit-content',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#FFD166',
                                                color: '#0B2E4F',
                                                borderRadius: 'var(--radius-md)',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                textTransform: 'uppercase'
                                            }}>
                                                {isArabic
                                                    ? (property.type === 'apartment' ? 'شقة' : property.type === 'villa' ? 'فيلا' : property.type)
                                                    : property.type}
                                            </div>

                                            {/* Title */}
                                            <h3 style={{
                                                fontSize: '2rem',
                                                fontWeight: 'bold',
                                                color: 'var(--text-primary)',
                                                margin: 0,
                                                lineHeight: 1.2
                                            }}>
                                                {property.address}
                                            </h3>

                                            {/* Location */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: 'var(--text-muted)',
                                                fontSize: '1.1rem'
                                            }}>
                                                <span>📍</span>
                                                <span>{isArabic ? property.areaNameAr || property.areaName : property.areaName}</span>
                                            </div>

                                            {/* Pricing */}
                                            <div style={{ marginTop: '1rem' }}>
                                                {/* Old Price */}
                                                <div style={{
                                                    fontSize: '1.1rem',
                                                    color: 'var(--text-muted)',
                                                    textDecoration: 'line-through',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    {formatPrice(originalPrice)}
                                                </div>

                                                {/* New Price */}
                                                <div style={{
                                                    fontSize: '2.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#EF4444',
                                                    display: 'flex',
                                                    alignItems: 'baseline',
                                                    gap: '0.5rem'
                                                }}>
                                                    {formatPrice(discountedPrice)}
                                                    <span style={{
                                                        fontSize: '1rem',
                                                        fontWeight: 'normal',
                                                        color: 'var(--text-muted)'
                                                    }}>
                                                        {isArabic ? 'وفر' : 'Save'} {formatPrice(originalPrice - discountedPrice)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* CTA Button */}
                                            <Link
                                                to={`/property/${property.id}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <button
                                                    className="btn btn-primary"
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem 2rem',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 'bold',
                                                        marginTop: '1rem',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(11, 46, 79, 0.3)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    {isArabic ? 'عرض العقار' : 'View Property'}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Arrows */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                aria-label={isArabic ? 'السابق' : 'Previous'}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: isArabic ? 'auto' : '-60px',
                                    right: isArabic ? '-60px' : 'auto',
                                    transform: 'translateY(-50%)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    border: '2px solid var(--border)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    color: 'var(--primary)',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'all 0.3s ease',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = 'var(--primary)';
                                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                }}
                            >
                                {isArabic ? '›' : '‹'}
                            </button>

                            <button
                                onClick={nextSlide}
                                aria-label={isArabic ? 'التالي' : 'Next'}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: isArabic ? 'auto' : '-60px',
                                    left: isArabic ? '-60px' : 'auto',
                                    transform: 'translateY(-50%)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    border: '2px solid var(--border)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    color: 'var(--primary)',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'all 0.3s ease',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = 'var(--primary)';
                                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                }}
                            >
                                {isArabic ? '‹' : '›'}
                            </button>
                        </>
                    )}

                    {/* Dots Indicators */}
                    {totalSlides > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            marginTop: '2rem'
                        }}>
                            {specialOfferProperties.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    style={{
                                        width: currentSlide === index ? '40px' : '12px',
                                        height: '12px',
                                        borderRadius: '6px',
                                        backgroundColor: currentSlide === index ? 'var(--primary)' : '#D1D5DB',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    .offer-slide > div {
                        grid-template-columns: 1fr !important;
                        height: auto !important;
                    }
                    
                    .offer-slide > div > div:first-child {
                        order: 1 !important;
                        height: 250px;
                    }
                    
                    .offer-slide > div > div:last-child {
                        order: 2 !important;
                        padding: 2rem 1.5rem !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default SpecialOffers;
