import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { calculateScore, getScoreColor } from '../utils/scoring';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import { useTranslation } from 'react-i18next';

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1} `}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '1rem',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                ‹
            </button>
            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '1rem',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                ›
            </button>

            {/* Dots */}
            <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.5rem'
            }}>
                {images.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const PropertyDetails = () => {
    const { id } = useParams();
    const { user, addLead, properties, submitInterest } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [message, setMessage] = useState('');

    // Try to find property in context (uploaded by marketers)
    let property = properties.find(p => p.id.toString() === id);

    // Fallback static data for demonstration if not found in context
    if (!property) {
        property = {
            id: id,
            image: 'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 850000,
            address: '123 Palm Avenue, Beverly Hills, CA',
            beds: 4,
            baths: 3,
            sqft: 2800,
            description: 'This stunning modern home features an open concept living area, a gourmet kitchen with stainless steel appliances, and a spacious backyard perfect for entertaining. Located in a quiet neighborhood with top-rated schools.',
            features: ['Central Air', 'Hardwood Floors', 'Fireplace', 'Garage', 'Pool']
        };
    }

    const score = calculateScore(property.price, property.sqft, property.beds, property.baths);
    const scoreColor = getScoreColor(score);

    const handleInterest = () => {
        console.log('handleInterest called, user:', user);

        if (!user) {
            setMessage('Please log in to express interest');
            return;
        }
        // if (user.role !== 'buyer') { // This check is now handled by submitInterest
        //     setMessage('Only buyers can express interest.');
        //     return;
        // }

        try {
            const userMessage = prompt('Add a message (optional):');
            console.log('Submitting interest for property:', property.id, 'message:', userMessage);

            const result = submitInterest(property.id, userMessage || '');
            console.log('Interest submitted, result:', result);

            setMessage('Interest submitted successfully! Admin will review it.');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Error submitting interest:', error);
            setMessage(error.message);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Listings</Link>

            <div style={{ height: '500px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem', position: 'relative', backgroundColor: '#000' }}>
                {property.discount_percentage > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: isArabic ? 'auto' : '20px',
                        right: isArabic ? '20px' : 'auto',
                        backgroundColor: '#EF4444',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        fontWeight: 'bold',
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {isArabic ? `خصم ${property.discount_percentage}%` : `Offer ${property.discount_percentage}%`}
                    </div>
                )}
                {property.images && property.images.length > 1 ? (
                    <ImageCarousel images={property.images} />
                ) : (
                    <img
                        src={property.image || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                        alt={property.address}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{property.address}</h1>
                            <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                                {formatPrice(property.price)}
                            </div>
                        </div>

                        {/* Only show Smart Score for Buyers */}
                        {user && user.role === 'buyer' && (
                            <div style={{
                                backgroundColor: 'white',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-sm)',
                                textAlign: 'center',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Smart Score</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: scoreColor, lineHeight: 1 }}>
                                    {score}
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{property.beds}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Beds</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{property.baths}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Baths</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{property.sqft}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Sqft</div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Description</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        {property.description}
                    </p>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Features</h3>
                    <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', listStylePosition: 'inside', color: 'var(--text-muted)' }}>
                        {property.features && property.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Contact Agent</h3>
                        {user && user.role === 'buyer' ? (
                            <>
                                <button
                                    onClick={handleInterest}
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginBottom: '1rem' }}
                                >
                                    I'm Interested
                                </button>
                                {message && (
                                    <div style={{
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: message.includes('sent') ? '#ECFDF5' : '#FFFBEB',
                                        color: message.includes('sent') ? '#065F46' : '#B45309',
                                        fontSize: '0.875rem',
                                        textAlign: 'center'
                                    }}>
                                        {message}
                                    </div>
                                )}
                            </>
                        ) : (
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>Contact Agent</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
