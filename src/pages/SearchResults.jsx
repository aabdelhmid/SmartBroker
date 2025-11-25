import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

const SearchResults = () => {
    const location = useLocation();
    const { searchGlobal, properties } = useAuth();
    const [results, setResults] = useState({ properties: [], agents: [], locations: [] });
    const [query, setQuery] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const q = searchParams.get('q') || '';
        const areaSlug = searchParams.get('area') || '';
        setQuery(q);

        if (q) {
            const searchResults = searchGlobal(q);
            setResults(searchResults);
        } else if (areaSlug) {
            // Filter properties by areaSlug using already fetched properties
            const filtered = properties.filter(p => p.areaSlug === areaSlug);
            setResults({ properties: filtered, agents: [], locations: [] });
        }

    }, [location.search, searchGlobal]);

    return (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Search Results for "{query}"
            </h2>

            {/* Locations Section */}
            {results.locations.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                        Locations
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {results.locations.map((loc, index) => (
                            <div key={index} style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#EFF6FF',
                                color: '#1D4ED8',
                                borderRadius: '999px',
                                fontWeight: 500
                            }}>
                                📍 {loc.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Properties Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Properties ({results.properties.length})
                </h3>
                {results.properties.length > 0 ? (
                    <div className="grid">
                        {results.properties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No properties found matching your criteria.</p>
                )}
            </div>

            {/* Agents Section */}
            {results.agents.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                        Agents ({results.agents.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {results.agents.map(agent => (
                            <div key={agent.id} style={{
                                padding: '1.5rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'white',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: '50%',
                                    margin: '0 auto 1rem auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem'
                                }}>
                                    👤
                                </div>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{agent.name}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{agent.email}</p>
                                <div style={{ marginTop: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#ECFDF5',
                                        color: '#059669',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {agent.role.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
