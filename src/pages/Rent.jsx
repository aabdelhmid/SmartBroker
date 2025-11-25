import React from 'react';
import PropertyCard from '../components/PropertyCard';

const Rent = () => {
    const properties = [
        {
            id: 101,
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 2500,
            address: '555 Maple Drive, Portland, OR',
            beds: 2,
            baths: 1,
            sqft: 900
        },
        {
            id: 102,
            image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 3800,
            address: '888 Broadway, New York, NY',
            beds: 1,
            baths: 1,
            sqft: 750
        },
        {
            id: 103,
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 3200,
            address: '777 Sunset Blvd, Los Angeles, CA',
            beds: 2,
            baths: 2,
            sqft: 1100
        }
    ];

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Homes for Rent</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
};

export default Rent;
