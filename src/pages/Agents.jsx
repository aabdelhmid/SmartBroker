import React from 'react';

const Agents = () => {
    const agents = [
        { id: 1, name: 'Sarah Johnson', role: 'Senior Broker', rating: 4.9, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Michael Chen', role: 'Real Estate Agent', rating: 4.8, image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Jessica Davis', role: 'Listing Specialist', rating: 5.0, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'David Wilson', role: 'Buyer\'s Agent', rating: 4.7, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
    ];

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Find an Agent</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                {agents.map(agent => (
                    <div key={agent.id} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', textAlign: 'center', padding: '2rem' }}>
                        <img src={agent.image} alt={agent.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{agent.name}</h3>
                        <p style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{agent.role}</p>
                        <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>★ {agent.rating}</div>
                        <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Contact</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Agents;
