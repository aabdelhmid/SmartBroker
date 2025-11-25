import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { areas } from '../data/areas';
import PropertyCard from '../components/PropertyCard';

const Properties = () => {
    const location = useLocation();
    const { properties } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [propertyType, setPropertyType] = useState('all');

    // Get approved properties
    const approvedProperties = properties.filter(p => p.status === 'approved');

    // Apply filters
    const filteredProperties = approvedProperties.filter(property => {
        // Search query filter (address, description)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                property.address?.toLowerCase().includes(query) ||
                property.description?.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Area filter
        if (selectedArea && property.areaSlug !== selectedArea) {
            return false;
        }

        // Price range filter
        if (minPrice && property.price < Number(minPrice)) {
            return false;
        }
        if (maxPrice && property.price > Number(maxPrice)) {
            return false;
        }

        // Property type filter
        if (propertyType !== 'all' && property.type !== propertyType) {
            return false;
        }

        return true;
    });

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F7F9FB' }}>
            {/* Hero Section */}
            <div style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '3rem 0 2rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {isArabic ? 'جميع العقارات' : 'All Properties'}
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        {isArabic
                            ? `${filteredProperties.length} عقار متاح`
                            : `${filteredProperties.length} properties available`}
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '3rem 0' }}>
                {/* Filters Section */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        {isArabic ? 'البحث والتصفية' : 'Search & Filter'}
                    </h3>

                    {/* First Row: Search, Area, Min Price */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1.25rem',
                        alignItems: 'end',
                        marginBottom: '1.25rem'
                    }}>
                        {/* Search Input */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)'
                            }}>
                                {isArabic ? 'البحث' : 'Search'}
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isArabic ? 'ابحث عن عقار...' : 'Search properties...'}
                                style={{
                                    width: '100%',
                                    height: '44px',
                                    padding: '0 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.95rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Area Filter */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)'
                            }}>
                                {isArabic ? 'المنطقة' : 'Area'}
                            </label>
                            <select
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '44px',
                                    padding: '0 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.95rem',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">{isArabic ? 'جميع المناطق' : 'All Areas'}</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.slug}>
                                        {isArabic ? area.nameAr : area.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Min Price */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)'
                            }}>
                                {isArabic ? 'السعر من' : 'Min Price'}
                            </label>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder={isArabic ? 'الحد الأدنى' : 'Min'}
                                style={{
                                    width: '100%',
                                    height: '44px',
                                    padding: '0 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.95rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    {/* Second Row: Max Price, Property Type, Clear Filters */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1.25rem',
                        alignItems: 'end'
                    }}>
                        {/* Max Price */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)'
                            }}>
                                {isArabic ? 'السعر إلى' : 'Max Price'}
                            </label>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder={isArabic ? 'الحد الأقصى' : 'Max'}
                                style={{
                                    width: '100%',
                                    height: '44px',
                                    padding: '0 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.95rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Property Type */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)'
                            }}>
                                {isArabic ? 'نوع العقار' : 'Property Type'}
                            </label>
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '44px',
                                    padding: '0 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.95rem',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="all">{isArabic ? 'جميع الأنواع' : 'All Types'}</option>
                                <option value="apartment">{isArabic ? 'شقة' : 'Apartment'}</option>
                                <option value="villa">{isArabic ? 'فيلا' : 'Villa'}</option>
                                <option value="office">{isArabic ? 'مكتب' : 'Office'}</option>
                                <option value="land">{isArabic ? 'أرض' : 'Land'}</option>
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                color: 'transparent',
                                userSelect: 'none'
                            }}>
                                .
                            </label>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedArea('');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setPropertyType('all');
                                }}
                                className="btn btn-outline"
                                style={{
                                    width: '100%',
                                    height: '44px',
                                    padding: '0 1rem',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {isArabic ? 'مسح الفلاتر' : 'Clear Filters'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div>
                    {filteredProperties.length > 0 ? (
                        <>
                            <div className="grid">
                                {filteredProperties.map(property => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏠</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                {isArabic ? 'لا توجد عقارات' : 'No Properties Found'}
                            </h3>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {isArabic
                                    ? 'جرب تغيير معايير البحث أو الفلاتر'
                                    : 'Try adjusting your search criteria or filters'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Properties;
