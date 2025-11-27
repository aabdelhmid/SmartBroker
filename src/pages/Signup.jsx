import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') === 'marketer' ? 'marketer' : 'buyer';

    const [role, setRole] = useState(initialRole); // 'buyer' or 'marketer'

    // Update role if query param changes
    useEffect(() => {
        const newRole = new URLSearchParams(location.search).get('role');
        if (newRole === 'marketer') setRole('marketer');
        else if (newRole === 'buyer') setRole('buyer');
    }, [location.search]);

    const { signup, areas } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        // Buyer specific
        budget_min: '',
        budget_max: '',
        preferred_locations: [],
        preferred_property_types: [],
        buying_intent: 'cash',
        // Marketer specific
        company: '',
        marketerRole: 'Marketer', // Marketer or Developer
        officeLocation: '',
        crNumber: '' // Commercial Registration
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const propertyTypes = ['apartment', 'villa', 'office', 'land', 'commercial'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        // Prepare user data based on role
        const userData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: role
        };

        if (role === 'buyer') {
            userData.budget_min = formData.budget_min ? parseFloat(formData.budget_min) : null;
            userData.budget_max = formData.budget_max ? parseFloat(formData.budget_max) : null;
            userData.preferred_locations = formData.preferred_locations;
            userData.preferred_property_types = formData.preferred_property_types;
            userData.buying_intent = formData.buying_intent;
        } else {
            userData.company = formData.company;
            userData.marketerRole = formData.marketerRole;
            userData.officeLocation = formData.officeLocation;
            userData.crNumber = formData.crNumber;
        }

        const result = await signup(userData);
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="container" style={{ maxWidth: '500px', marginTop: '4rem', marginBottom: '4rem', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#ECFDF5', color: '#065F46', padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Registration Successful! 🎉</h2>
                    <p style={{ marginBottom: '1.5rem' }}>Your account has been created successfully.</p>
                    <Link to="/login">
                        <button className="btn btn-primary">Go to Login</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '4rem', marginBottom: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>

            {/* Role Switcher */}
            <div style={{
                display: 'flex',
                marginBottom: '2rem',
                backgroundColor: '#F1F5F9',
                padding: '0.5rem',
                borderRadius: 'var(--radius-lg)',
                gap: '0.5rem'
            }}>
                <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        backgroundColor: role === 'buyer' ? 'white' : 'transparent',
                        boxShadow: role === 'buyer' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        color: role === 'buyer' ? 'var(--primary)' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Buyer
                </button>
                <button
                    type="button"
                    onClick={() => setRole('marketer')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        backgroundColor: role === 'marketer' ? 'white' : 'transparent',
                        boxShadow: role === 'marketer' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        color: role === 'marketer' ? 'var(--primary)' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Marketer / Developer
                </button>
            </div>

            {error && (
                <div style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Common Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="input"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input"
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="input"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="input"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

                {/* Buyer Specific Fields */}
                {role === 'buyer' && (
                    <>
                        <h4 style={{ margin: '1rem 0 0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Preferences (Optional)</h4>

                        {/* Budget */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Min Budget (EGP)</label>
                                <input
                                    type="number"
                                    name="budget_min"
                                    value={formData.budget_min}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g. 1,000,000"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Max Budget (EGP)</label>
                                <input
                                    type="number"
                                    name="budget_max"
                                    value={formData.budget_max}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g. 50,000,000+"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        {/* Buying Intent */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Buying Intent</label>
                            <select
                                name="buying_intent"
                                value={formData.buying_intent}
                                onChange={handleChange}
                                className="input"
                                style={{ width: '100%' }}
                            >
                                <option value="cash">Cash</option>
                                <option value="installments">Installments</option>
                                <option value="mortgage">Mortgage</option>
                            </select>
                        </div>

                        {/* Property Types */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Preferred Property Types</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {propertyTypes.map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Preferred Locations</label>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                maxHeight: '150px',
                                overflowY: 'auto',
                                padding: '0.5rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                {areas && areas.length > 0 ? areas.map(area => (
                                    <label key={area.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '140px', fontSize: '0.875rem' }}>
                                        <input
                                            type="checkbox"
                                            value={area.slug}
                                            checked={formData.preferred_locations.includes(area.slug)}
                                            onChange={(e) => handleArrayChange(e, 'preferred_locations')}
                                        />
                                        {area.name}
                                    </label>
                                )) : <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading locations...</p>}
                            </div>
                        </div>
                    </>
                )}

                {/* Marketer Specific Fields */}
                {role === 'marketer' && (
                    <>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Role</label>
                            <select
                                name="marketerRole"
                                value={formData.marketerRole}
                                onChange={handleChange}
                                className="input"
                                style={{ width: '100%' }}
                            >
                                <option value="Marketer">Marketer</option>
                                <option value="Developer">Developer</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Company Name (Optional)</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="input"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Office Location</label>
                            <input
                                type="text"
                                name="officeLocation"
                                value={formData.officeLocation}
                                onChange={handleChange}
                                required
                                className="input"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Commercial Registration (Optional)</label>
                            <input
                                type="file"
                                name="crNumber"
                                className="input"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Log In</Link>
            </p>
        </div>
    );
};

export default Signup;
