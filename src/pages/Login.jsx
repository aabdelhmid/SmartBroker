import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (login(email, password)) {
            navigate('/');
        } else {
            setError('Invalid email or password. Please register if you haven\'t already.');
        }
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
                    style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                />
                <button type="submit" className="btn btn-primary">Log In</button>
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
