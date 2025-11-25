import React from 'react';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

const Buy = () => {
    const { properties } = useAuth();

    // Only show approved dynamic properties
    const approvedProperties = properties.filter(p => p.status === 'approved');
    const allProperties = approvedProperties;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Homes for Sale</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Showing {allProperties.length} properties ({approvedProperties.length} new)
                </span>
            </div>
            <div className="grid">
                {allProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
};

export default Buy;
