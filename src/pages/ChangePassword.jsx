import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ChangePassword = () => {
    const { user, changePassword } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    if (!user) {
        navigate('/login');
        return null;
    }

    // Password validation function
    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);

        return {
            isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial,
            checks: { minLength, hasUppercase, hasLowercase, hasNumber, hasSpecial }
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        // Validation
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = t('changePassword.error.required');
        }

        if (!formData.newPassword) {
            newErrors.newPassword = t('changePassword.error.required');
        } else {
            const validation = validatePassword(formData.newPassword);
            if (!validation.isValid) {
                newErrors.newPassword = t('changePassword.error.requirements');
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('changePassword.error.required');
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = t('changePassword.error.mismatch');
        }

        // Check if new password is same as current
        if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = t('changePassword.error.sameAsOld');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit
        setIsLoading(true);
        try {
            const result = await changePassword(formData.currentPassword, formData.newPassword);

            if (result.success) {
                setSuccessMessage(t('changePassword.success'));
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                // Optionally redirect after 2 seconds
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            } else {
                setErrors({ currentPassword: result.error || t('changePassword.error.incorrectCurrent') });
            }
        } catch (error) {
            setErrors({ general: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const passwordValidation = validatePassword(formData.newPassword);
    const isFormValid = formData.currentPassword && formData.newPassword && formData.confirmPassword &&
        passwordValidation.isValid && formData.newPassword === formData.confirmPassword;

    return (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                    {t('changePassword.title')}
                </h1>

                {successMessage && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#10B981',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        {successMessage}
                    </div>
                )}

                {errors.general && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#EF4444',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem'
                    }}>
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    {/* Current Password */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            {t('changePassword.currentPassword')}
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${errors.currentPassword ? '#EF4444' : 'var(--border)'}`,
                                fontSize: '1rem'
                            }}
                        />
                        {errors.currentPassword && (
                            <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                {errors.currentPassword}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            {t('changePassword.newPassword')}
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${errors.newPassword ? '#EF4444' : 'var(--border)'}`,
                                fontSize: '1rem'
                            }}
                        />
                        {errors.newPassword && (
                            <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                {errors.newPassword}
                            </p>
                        )}

                        {/* Password Requirements */}
                        {formData.newPassword && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                backgroundColor: '#F3F4F6',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem'
                            }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                                    {t('changePassword.requirements.title')}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ color: passwordValidation.checks.minLength ? '#10B981' : '#6B7280' }}>
                                        {passwordValidation.checks.minLength ? '✓' : '○'} {t('changePassword.requirements.minLength')}
                                    </div>
                                    <div style={{ color: passwordValidation.checks.hasUppercase ? '#10B981' : '#6B7280' }}>
                                        {passwordValidation.checks.hasUppercase ? '✓' : '○'} {t('changePassword.requirements.uppercase')}
                                    </div>
                                    <div style={{ color: passwordValidation.checks.hasLowercase ? '#10B981' : '#6B7280' }}>
                                        {passwordValidation.checks.hasLowercase ? '✓' : '○'} {t('changePassword.requirements.lowercase')}
                                    </div>
                                    <div style={{ color: passwordValidation.checks.hasNumber ? '#10B981' : '#6B7280' }}>
                                        {passwordValidation.checks.hasNumber ? '✓' : '○'} {t('changePassword.requirements.number')}
                                    </div>
                                    <div style={{ color: passwordValidation.checks.hasSpecial ? '#10B981' : '#6B7280' }}>
                                        {passwordValidation.checks.hasSpecial ? '✓' : '○'} {t('changePassword.requirements.special')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            {t('changePassword.confirmPassword')}
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${errors.confirmPassword ? '#EF4444' : 'var(--border)'}`,
                                fontSize: '1rem'
                            }}
                        />
                        {errors.confirmPassword && (
                            <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                {errors.confirmPassword}
                            </p>
                        )}
                        {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                            <p style={{ color: '#10B981', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                ✓ Passwords match
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="btn btn-outline"
                        >
                            {t('changePassword.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!isFormValid || isLoading}
                            style={{
                                opacity: (!isFormValid || isLoading) ? 0.5 : 1,
                                cursor: (!isFormValid || isLoading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Saving...' : t('changePassword.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
