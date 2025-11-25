import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { areas } from '../data/areas';

const Areas = () => {
    const { properties } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    // Filter and pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Calculate property count for each area
    const areasWithCount = areas.map(area => ({
        ...area,
        count: properties.filter(p => p.areaSlug === area.slug && p.status === 'approved').length
    }));

    // Get unique cities for filter
    const cities = useMemo(() => {
        const uniqueCities = [...new Set(areas.map(a => ({ en: a.city, ar: a.cityAr })))];
        return uniqueCities.filter((city, index, self) =>
            index === self.findIndex(c => c.en === city.en)
        );
    }, []);

    // Apply filters
    const filteredAreas = areasWithCount.filter(area => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                area.name.toLowerCase().includes(query) ||
                area.nameAr.includes(query) ||
                area.city.toLowerCase().includes(query) ||
                area.cityAr.includes(query);
            if (!matchesSearch) return false;
        }

        // City filter
        if (selectedCity && area.city !== selectedCity) {
            return false;
        }

        return true;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredAreas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAreas = filteredAreas.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCity]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F7F9FB' }}>
            {/* Hero Section */}
            <div style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '4rem 0 3rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        {isArabic ? 'استكشف المناطق' : 'Explore Areas'}
                    </h1>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                        {isArabic
                            ? 'اكتشف أفضل المناطق في القاهرة الكبرى وابحث عن عقارك المثالي'
                            : 'Discover the best areas in Greater Cairo and find your perfect property'}
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="container" style={{ padding: '3rem 0 0' }}>
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

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1.25rem',
                        alignItems: 'end'
                    }}>
                        {/* Search Input */}
                        <div style={{ gridColumn: 'span 1' }}>
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
                                placeholder={isArabic ? 'ابحث عن منطقة...' : 'Search areas...'}
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

                        {/* City Filter */}
                        <div style={{ gridColumn: 'span 1' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)'
                            }}>
                                {isArabic ? 'المدينة' : 'City'}
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
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
                                <option value="">{isArabic ? 'جميع المدن' : 'All Cities'}</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city.en}>
                                        {isArabic ? city.ar : city.en}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div style={{ gridColumn: 'span 1' }}>
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
                                    setSelectedCity('');
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

                    {/* Results Count */}
                    <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isArabic
                            ? `عرض ${paginatedAreas.length} من ${filteredAreas.length} منطقة`
                            : `Showing ${paginatedAreas.length} of ${filteredAreas.length} areas`}
                    </div>
                </div>
            </div>

            {/* Areas Grid */}
            <div className="container" style={{ padding: '0 0 4rem' }}>
                {paginatedAreas.length > 0 ? (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem',
                            marginBottom: '3rem'
                        }}>
                            {paginatedAreas.map((area) => (
                                <Link
                                    key={area.id}
                                    to={`/search?area=${area.slug}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            backgroundColor: 'white',
                                            borderRadius: 'var(--radius-lg)',
                                            overflow: 'hidden',
                                            boxShadow: 'var(--shadow-sm)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            height: '100%'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        }}
                                    >
                                        {/* Image */}
                                        <div style={{
                                            position: 'relative',
                                            height: '200px',
                                            overflow: 'hidden'
                                        }}>
                                            <img
                                                src={area.image}
                                                alt={area.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)'
                                            }} />
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '1.5rem' }}>
                                            <h3 style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                marginBottom: '0.5rem',
                                                color: 'var(--text-primary)'
                                            }}>
                                                {isArabic ? area.nameAr : area.name}
                                            </h3>
                                            <p style={{
                                                color: 'var(--text-muted)',
                                                fontSize: '0.95rem',
                                                marginBottom: '0.75rem'
                                            }}>
                                                📍 {isArabic ? area.cityAr : area.city}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#F0F5FA',
                                                borderRadius: 'var(--radius-md)',
                                                width: 'fit-content'
                                            }}>
                                                <span style={{
                                                    fontWeight: 'bold',
                                                    color: 'var(--primary)',
                                                    fontSize: '1.1rem'
                                                }}>
                                                    {area.count}
                                                </span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    {isArabic ? 'عقار' : 'Properties'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginTop: '2rem'
                            }}>
                                {/* Previous Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                                        color: currentPage === 1 ? 'var(--text-muted)' : 'var(--primary)',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    {isArabic ? '←' : '←'} {isArabic ? 'السابق' : 'Previous'}
                                </button>

                                {/* Page Numbers */}
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        // Show first, last, current, and adjacent pages
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    style={{
                                                        padding: '0.5rem 0.75rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: '1px solid var(--border)',
                                                        backgroundColor: currentPage === pageNum ? 'var(--primary)' : 'white',
                                                        color: currentPage === pageNum ? 'white' : 'var(--text-primary)',
                                                        cursor: 'pointer',
                                                        fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                                                        minWidth: '40px'
                                                    }}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 2 ||
                                            pageNum === currentPage + 2
                                        ) {
                                            return <span key={pageNum} style={{ padding: '0.5rem' }}>...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                                        color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--primary)',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    {isArabic ? 'التالي' : 'Next'} {isArabic ? '→' : '→'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📍</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                            {isArabic ? 'لا توجد مناطق' : 'No Areas Found'}
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
    );
};

export default Areas;
