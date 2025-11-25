import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>

            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h3 style={{ margin: 0 }}>{user.name}</h3>
                        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>{user.role === 'marketer' ? 'Real Estate Professional' : 'Home Buyer'}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email</label>
                        <div style={{ fontWeight: 500 }}>{user.email}</div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Phone</label>
                        <div style={{ fontWeight: 500 }}>{user.phone || 'Not provided'}</div>
                    </div>

                    {user.role === 'buyer' && (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Budget Range</label>
                                <div style={{ fontWeight: 500 }}>{user.budget || 'Not specified'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Preferred Location</label>
                                <div style={{ fontWeight: 500 }}>{user.preferredLocation || 'Not specified'}</div>
                            </div>
                        </>
                    )}

                    {user.role === 'marketer' && (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Company</label>
                                <div style={{ fontWeight: 500 }}>{user.company || 'Not provided'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Professional Role</label>
                                <div style={{ fontWeight: 500 }}>{user.marketerRole}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Office Location</label>
                                <div style={{ fontWeight: 500 }}>{user.officeLocation}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Change Password Button */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                <Link to="/change-password">
                    <button className="btn btn-primary" style={{ width: '100%' }}>
                        🔐 Change Password
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Profile;
