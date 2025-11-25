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

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        // Buyer specific
        budget: '',
        location: '',
        // Marketer specific
        company: '',
        marketerRole: 'Marketer', // Marketer or Developer
        officeLocation: '',
        crNumber: '' // Commercial Registration
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
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
            userData.budget = formData.budget;
            userData.preferredLocation = formData.location;
        } else {
            userData.company = formData.company;
            userData.marketerRole = formData.marketerRole;
            userData.officeLocation = formData.officeLocation;
            userData.crNumber = formData.crNumber;
        }

        const result = signup(userData);
        if (result.success) {
            setSuccess(true);
            // navigate('/'); // Removed auto-redirect
        } else {
            setError(result.error);
        }
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
        <div className="container" style={{ maxWidth: '500px', marginTop: '4rem', marginBottom: '4rem' }}>
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
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
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
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
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
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                </div>

                {/* Buyer Specific Fields */}
                {role === 'buyer' && (
                    <>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Budget Range (Optional)</label>
                            <select
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                            >
                                <option value="">Select Budget</option>
                                <option value="0-500k">Under $500k</option>
                                <option value="500k-1m">$500k - $1M</option>
                                <option value="1m+">$1M+</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Preferred Location (Optional)</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Downtown, Suburbs"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                            />
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
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
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
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
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
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Commercial Registration (Optional)</label>
                            <input
                                type="file"
                                name="crNumber"
                                // In a real app, handle file upload
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Create Account
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Log In</Link>
            </p>
        </div>
    );
};

export default Signup;

