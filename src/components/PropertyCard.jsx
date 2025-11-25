import React from 'react';
import { Link } from 'react-router-dom';
import { calculateScore, getScoreColor } from '../utils/scoring';
import { formatPrice } from '../utils/formatPrice';
import { useTranslation } from 'react-i18next';

const PropertyCard = ({ property }) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const { id, image, price, address, beds, baths, sqft, discount_percentage } = property;
    const score = calculateScore(price, sqft, beds, baths);
    const scoreColor = getScoreColor(score);

    return (
        <Link to={`/property/${id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                position: 'relative'
            }}>
                {discount_percentage > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        backgroundColor: '#EF4444',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {isArabic ? `خصم ${discount_percentage}%` : `Offer ${discount_percentage}%`}
                    </div>
                )}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: scoreColor,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                }}>
                    {score}
                </div>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                        src={image}
                        alt={address}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'var(--text-main)',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        {formatPrice(price)}
                    </div>
                    <div style={{
                        color: 'var(--text-main)',
                        fontWeight: 500,
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        {address}
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem'
                    }}>
                        <span><strong>{beds}</strong> bds</span>
                        <span><strong>{baths}</strong> ba</span>
                        <span><strong>{sqft}</strong> sqft</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
