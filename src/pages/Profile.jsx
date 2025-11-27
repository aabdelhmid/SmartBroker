import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Profile = () => {
    const { user, updateProfile, areas } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        budget_min: '',
        budget_max: '',
        preferred_locations: [],
        preferred_property_types: [],
        buying_intent: 'cash'
    });

    const propertyTypes = ['apartment', 'villa', 'office', 'land', 'commercial'];

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                budget_min: user.budget_min || '',
                budget_max: user.budget_max || '',
                preferred_locations: user.preferred_locations || [],
                preferred_property_types: user.preferred_property_types || [],
                buying_intent: user.buying_intent || 'cash'
            });
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const current = prev[field] || [];
            if (checked) {
                return { ...prev, [field]: [...current, value] };
            } else {
                return { ...prev, [field]: current.filter(item => item !== value) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const updates = {
            name: formData.name,
            phone: formData.phone,
            budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
            budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
            preferred_locations: formData.preferred_locations,
            preferred_property_types: formData.preferred_property_types,
            buying_intent: formData.buying_intent
        };

        const { success, error } = await updateProfile(updates);

        if (success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } else {
            setMessage({ type: 'error', text: error });
        }
        setLoading(false);
    };

    return (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>My Profile</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline"
                    >
                        ✏️ Edit Profile
                    </button>
                )}
            </div>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                    color: message.type === 'success' ? '#059669' : '#DC2626'
                }}>
                    {message.text}
                </div>
            )}

            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)'
            }}>
                {/* Header */}
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
                        {user.score && (
                            <div style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 'bold', backgroundColor: user.score >= 80 ? '#ECFDF5' : user.score >= 60 ? '#FEF3C7' : '#F3F4F6', color: user.score >= 80 ? '#059669' : user.score >= 60 ? '#D97706' : '#6B7280' }}>
                                Lead Score: {user.score}
                            </div>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Basic Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="+20..."
                                    />
                                </div>
                            </div>

                            {user.role === 'buyer' && (
                                <>
                                    <h4 style={{ margin: '1rem 0 0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Preferences</h4>

                                    {/* Budget */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Min Budget (EGP)</label>
                                            <input
                                                type="number"
                                                name="budget_min"
                                                value={formData.budget_min}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="e.g. 1,000,000"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Max Budget (EGP)</label>
                                            <input
                                                type="number"
                                                name="budget_max"
                                                value={formData.budget_max}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="e.g. 50,000,000+"
                                            />
                                            <small style={{ color: 'var(--text-muted)' }}>Up to 50M+ supported</small>
                                        </div>
                                    </div>

                                    {/* Buying Intent */}
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Buying Intent</label>
                                        <select
                                            name="buying_intent"
                                            value={formData.buying_intent}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="installments">Installments</option>
                                            <option value="mortgage">Mortgage</option>
                                        </select>
                                    </div>

                                    {/* Property Types */}
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Preferred Property Types</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                            {propertyTypes.map(type => (
                                                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        value={type}
                                                        checked={formData.preferred_property_types.includes(type)}
                                                        onChange={(e) => handleArrayChange(e, 'preferred_property_types')}
                                                    />
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Locations */}
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Preferred Locations</label>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '1rem',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            padding: '0.5rem',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-md)'
                                        }}>
                                            {areas.length > 0 ? areas.map(area => (
                                                <label key={area.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '150px' }}>
                                                    <input
                                                        type="checkbox"
                                                        value={area.slug}
                                                        checked={formData.preferred_locations.includes(area.slug)}
                                                        onChange={(e) => handleArrayChange(e, 'preferred_locations')}
                                                    />
                                                    {area.name}
                                                </label>
                                            )) : <p style={{ color: 'var(--text-muted)' }}>Loading locations...</p>}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn btn-outline"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
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
                                    <div style={{ fontWeight: 500 }}>
                                        {user.budget_min ? `${user.budget_min.toLocaleString()} EGP` : 'Min'} - {user.budget_max ? `${user.budget_max.toLocaleString()} EGP` : 'Max'}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Buying Intent</label>
                                    <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user.buying_intent || 'Not specified'}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Preferred Locations</label>
                                    <div style={{ fontWeight: 500 }}>
                                        {user.preferred_locations && user.preferred_locations.length > 0
                                            ? user.preferred_locations.join(', ')
                                            : 'Not specified'}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Preferred Types</label>
                                    <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                        {user.preferred_property_types && user.preferred_property_types.length > 0
                                            ? user.preferred_property_types.join(', ')
                                            : 'Not specified'}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
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
