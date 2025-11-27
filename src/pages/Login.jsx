import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Check if we should redirect to onboarding
            const params = new URLSearchParams(location.search);
            const shouldRedirectToOnboarding = params.get('redirect') === 'onboarding';

            if (shouldRedirectToOnboarding) {
                navigate('/onboarding');
            } else {
                navigate('/');
            }
        } else {
            setError(result.error || 'Invalid email or password. Please register if you haven\'t already.');
        }

        setLoading(false);
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Log In</h2>
            {error && (
                <div style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input"
                    style={{ width: '100%' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input"
                    style={{ width: '100%' }}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign Up</Link>
            </p>
            <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                Are you a Real Estate Pro? <Link to="/signup?role=marketer" style={{ color: 'var(--accent)' }}>Register here</Link>
            </p>
        </div>
    );
};

export default Login;
